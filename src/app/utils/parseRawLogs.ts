import type { Log, LogLevel } from '../components/RequestFlow';

const LOG_REGEX =
  /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\]\s*\[(\w+)\]\s*\[request_id=([^\]]+)\]\s*\[thread=([^\]]+)\]\s*\[class=([^\]]+)\]\s*\[method=([^\]]+)\]\s*\[pod=([^\]]+)\]\s*-\s*(.+)$/s;

const POD_SERVICE_MAP: Record<string, string> = {
  'du-bff': 'BFF',
  'du-df-bff': 'BFF',
  'du-ngil-lite': 'GraphQL Orchestrator',
  'service-du-ng11-lite': 'GraphQL Orchestrator',
};

const API_PATH_REGEX = /\/api\/v\d+\/tbapi\/(\w+)\//;

const DOWNSTREAM_NAMES: Record<string, string> = {
  addressManagement: 'Address Management API',
  accountManagement: 'Account Management API',
  paymentManagement: 'Payment Management API',
  inventoryManagement: 'Inventory Management API',
  balanceManagement: 'Balance Management API',
  profileManagement: 'Profile Management API',
  orderManagement: 'Order Management API',
  subscriptionManagement: 'Subscription Management API',
};

function resolveService(pod: string): string {
  if (POD_SERVICE_MAP[pod]) return POD_SERVICE_MAP[pod];
  for (const [key, name] of Object.entries(POD_SERVICE_MAP)) {
    if (pod.includes(key)) return name;
  }
  return pod;
}

function extractDownstream(message: string): string | null {
  const match = message.match(API_PATH_REGEX);
  if (!match) return null;
  return DOWNSTREAM_NAMES[match[1]] ?? match[1];
}

function normalizeLevel(raw: string): LogLevel {
  switch (raw.toUpperCase()) {
    case 'ERROR': return 'error';
    case 'WARN':
    case 'WARNING': return 'warn';
    case 'DEBUG': return 'debug';
    default: return 'info';
  }
}

function cleanMessage(raw: string): string {
  let msg = raw;
  msg = msg.replace(/Bearer\s+eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, 'Bearer [token]');
  msg = msg.replace(/X-User-Token:"eyJ[^"]+"/g, 'X-User-Token:"[token]"');
  msg = msg.replace(/JSESSIONID=[^;"\s]+/g, 'JSESSIONID=[...]');
  msg = msg.replace(/STICKY-SESSION-ID=[^;"\s]+/g, 'STICKY-SESSION-ID=[...]');

  const headersIdx = msg.indexOf('| Headers:');
  if (headersIdx !== -1) {
    const afterHeaders = msg.indexOf('|', headersIdx + 10);
    if (afterHeaders !== -1) {
      msg = msg.substring(0, headersIdx) + msg.substring(afterHeaders);
    } else {
      msg = msg.substring(0, headersIdx).trim();
    }
  }

  return msg.replace(/\s{2,}/g, ' ').trim();
}

export interface RawLogLine {
  raw: string;
  host?: string;
}

export function parseRawLogs(lines: RawLogLine[]): Log[] {
  const logs: Log[] = [];
  let lastOutgoingDownstream: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const { raw, host } = lines[i];
    const match = raw.match(LOG_REGEX);
    if (!match) continue;

    const [, timestamp, level, requestId, , , method, pod, message] = match;

    const downstream = extractDownstream(message);

    const isOutgoing = message.includes('Outgoing Request') || message.includes('Outgoing GQL');
    if (isOutgoing && downstream) {
      lastOutgoingDownstream = downstream;
    }

    const isAxiosResponse = message.includes('Axios Incoming Response') ||
      (method.includes('Incoming') && message.includes('Axios'));

    let service: string;
    if (isAxiosResponse) {
      service = downstream ?? lastOutgoingDownstream ?? resolveService(pod);
      lastOutgoingDownstream = null;
    } else {
      service = resolveService(pod);
    }

    logs.push({
      id: String(i + 1),
      timestamp: new Date(timestamp.replace(' ', 'T') + 'Z').toISOString(),
      container: pod,
      service,
      level: normalizeLevel(level),
      message: cleanMessage(message),
      host: host ?? pod,
      requestId,
    });
  }

  return logs;
}

export function parseRawLogText(text: string): Log[] {
  const lines: RawLogLine[] = [];
  let currentHost = '';

  for (const line of text.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('logging-fluentd') || trimmed.startsWith('pod-')) {
      currentHost = trimmed;
      continue;
    }

    const clean = trimmed.replace(/^`+|`+$/g, '');
    if (clean.startsWith('[')) {
      lines.push({ raw: clean, host: currentHost || undefined });
    }
  }

  return parseRawLogs(lines);
}
