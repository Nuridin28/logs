import type { Log, LogLevel } from '../components/RequestFlow';

export interface ApiLogMessage {
  container: string;
  keyword: string | null;
  timestampFromMessage: string;
  timestampFromGL: string;
  message: string;
  timeParsed: string;
}

export interface ApiLogResponse {
  messages: ApiLogMessage[];
  totalPages: number;
}

const CONTAINER_SERVICE_MAP: Record<string, string> = {
  'du-bff': 'BFF',
  'du-df-bff': 'BFF',
  'du-ngil-lite': 'GraphQL Orchestrator',
  'service-du-ng11-lite': 'GraphQL Orchestrator',
  'public-frontend-gateway': 'Frontend Gateway',
  'gateway-auth-extension': 'Auth Gateway',
  'du-token-brokering': 'Token Brokering',
};

function resolveService(container: string): string {
  if (CONTAINER_SERVICE_MAP[container]) return CONTAINER_SERVICE_MAP[container];
  for (const [key, name] of Object.entries(CONTAINER_SERVICE_MAP)) {
    if (container.includes(key)) return name;
  }
  return container;
}

function resolveLevel(keyword: string | null, message: string): LogLevel {
  const lower = message.toLowerCase();
  if (lower.includes('error') || lower.includes('fail') || lower.includes('503') || lower.includes('500')) return 'error';
  if (lower.includes('warn')) return 'warn';
  if (keyword === null) return 'debug';
  return 'info';
}

function buildLabel(keyword: string | null, container: string): string {
  const service = resolveService(container);
  switch (keyword) {
    case 'Incoming': return `Incoming request → ${service}`;
    case 'Outgoing': return `Outgoing request ← ${service}`;
    case 'Request': return `Request → ${service}`;
    default: return service;
  }
}

export function parseApiLogs(response: ApiLogResponse, requestId: string): Log[] {
  return response.messages.map((msg, i) => ({
    id: String(i + 1),
    timestamp: msg.timeParsed || msg.timestampFromMessage,
    container: msg.container,
    service: resolveService(msg.container),
    level: resolveLevel(msg.keyword, msg.message),
    message: buildLabel(msg.keyword, msg.container),
    host: msg.container,
    requestId,
  }));
}
