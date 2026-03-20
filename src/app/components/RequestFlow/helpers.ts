import { SERVICE_COLORS } from './constants';
import type { FlowEdge, FlowNode, Log, LogLevel, RequestFlow, SeqEvent } from './types';

export const getColor = (i: number): string =>
  SERVICE_COLORS[i % SERVICE_COLORS.length];

export function formatTimestamp(
  timestamp: string,
  options?: { includeYear?: boolean; fractionalSeconds?: boolean },
): string {
  const date = new Date(timestamp);

  if (options?.fractionalSeconds) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(options?.includeYear && { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

function levelPriority(level: LogLevel): number {
  switch (level) {
    case 'error': return 4;
    case 'warn': return 3;
    case 'info': return 2;
    case 'debug': return 1;
    default: return 0;
  }
}

function shortenLabel(msg: string): string {
  let label = msg;

  label = label.replace(/\s*\|.*$/, '');
  label = label.replace(/\s*Started At:.*$/i, '');
  label = label.replace(/https?:\/\/[^\s|,]+/g, '');
  label = label.replace(/url=[^\s,]*/g, '');
  label = label.replace(/\?[^\s|,]*/g, '');
  label = label.replace(/\{[^}]*\}/g, '');
  label = label.replace(/body=\S*/g, '');
  label = label.replace(/data:\s*\S*/g, '');
  label = label.replace(/\/api\/v\d+\/tbapi\/\w+\/\w*/g, (m) => {
    const parts = m.split('/').filter(Boolean);
    return parts[parts.length - 1] || m;
  });
  label = label.replace(/,\s*,/g, ',');
  label = label.replace(/\s{2,}/g, ' ');
  label = label.replace(/[—\-,\s]+$/, '');
  label = label.replace(/^[—\-,\s]+/, '');

  return label.trim() || msg.slice(0, 50);
}

export function buildGraphFromLogs(logs: Log[]): RequestFlow {
  if (logs.length === 0) return { nodes: [], edges: [] };

  const sorted = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const serviceOrder: string[] = [];
  const worstLevel: Record<string, LogLevel> = {};

  for (const log of sorted) {
    if (!serviceOrder.includes(log.service)) {
      serviceOrder.push(log.service);
    }
    const cur = worstLevel[log.service];
    if (!cur || levelPriority(log.level) > levelPriority(cur)) {
      worstLevel[log.service] = log.level;
    }
  }

  const nodes: FlowNode[] = serviceOrder.map((name, i) => ({
    id: `n-${i}`,
    name,
    type: i === 0 ? 'client' as const : 'service' as const,
    status: worstLevel[name] === 'error' ? 'error' as const : 'success' as const,
  }));

  const edges: FlowEdge[] = [];
  const stack: string[] = [];
  const requestTime: Record<string, number> = {};
  const serviceMsg: Record<string, string> = {};
  const serviceLastLogId: Record<string, string> = {};
  const serviceLastErrorLogId: Record<string, string> = {};
  let edgeId = 0;
  let firstError = true;
  let prevService = '';

  for (const log of sorted) {
    const ts = new Date(log.timestamp).getTime();
    serviceMsg[log.service] = log.message;
    serviceLastLogId[log.service] = log.id;
    if (log.level === 'error' || log.level === 'warn') {
      serviceLastErrorLogId[log.service] = log.id;
    }

    if (log.service === prevService) continue;
    prevService = log.service;

    if (stack.length === 0) {
      stack.push(log.service);
      requestTime[log.service] = ts;
      continue;
    }

    if (log.service === stack[stack.length - 1]) continue;

    const stackIdx = stack.indexOf(log.service);

    if (stackIdx !== -1) {
      while (stack.length > stackIdx + 1) {
        const from = stack.pop()!;
        const to = stack[stack.length - 1];
        const reqTs = requestTime[from] ?? ts;
        const duration = ts - reqTs;
        const isErr = worstLevel[from] === 'error';

        edges.push({
          id: `e-${edgeId++}`,
          from,
          to,
          type: 'response',
          timestamp: log.timestamp,
          status: isErr ? 'error' : 'success',
          duration: duration > 0 ? duration : undefined,
          label: isErr ? shortenLabel(serviceMsg[from]) : undefined,
          isErrorSource: isErr && firstError ? true : undefined,
          relatedLogId: (isErr && serviceLastErrorLogId[from]) || serviceLastLogId[from],
        });

        if (isErr && firstError) firstError = false;
      }
    } else {
      const sender = stack[stack.length - 1];
      edges.push({
        id: `e-${edgeId++}`,
        from: sender,
        to: log.service,
        type: 'request',
        timestamp: log.timestamp,
        status: 'success',
        label: shortenLabel(serviceMsg[sender]),
        relatedLogId: serviceLastLogId[sender],
      });
      stack.push(log.service);
      requestTime[log.service] = ts;
    }
  }

  const lastTs = new Date(sorted[sorted.length - 1].timestamp).getTime();
  while (stack.length > 1) {
    const from = stack.pop()!;
    const to = stack[stack.length - 1];
    const reqTs = requestTime[from] ?? lastTs;
    const duration = lastTs - reqTs;
    const isErr = worstLevel[from] === 'error';

    edges.push({
      id: `e-${edgeId++}`,
      from,
      to,
      type: 'response',
      timestamp: sorted[sorted.length - 1].timestamp,
      status: isErr ? 'error' : 'success',
      duration: duration > 0 ? duration : undefined,
      label: isErr ? shortenLabel(serviceMsg[from]) : undefined,
      isErrorSource: isErr && firstError ? true : undefined,
      relatedLogId: (isErr && serviceLastErrorLogId[from]) || serviceLastLogId[from],
    });

    if (isErr && firstError) firstError = false;
  }

  return { nodes, edges };
}

export function buildSequence(edges: FlowEdge[], services: string[]): SeqEvent[] {
  if (edges.length === 0) return [];

  const colOf = (name: string): number => {
    const idx = services.indexOf(name);
    return idx !== -1 ? idx : 0;
  };

  return edges.map((edge) => ({
    id: edge.id,
    fromCol: colOf(edge.from),
    toCol: colOf(edge.to),
    label: edge.label ?? (edge.type === 'response'
      ? (edge.status === 'error' ? 'Error' : 'OK')
      : `→ ${edge.to}`),
    status: edge.status,
    duration: edge.duration,
    isResponse: edge.type === 'response',
    timestamp: edge.timestamp,
    isErrorSource: edge.isErrorSource,
    relatedLogId: edge.relatedLogId,
  }));
}
