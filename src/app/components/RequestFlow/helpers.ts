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
  return ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function formatDurationPrecise(ms: number): string {
  return ms > 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
}

// ─── Build graph from raw logs ───────────────────────────────────────────────

function levelPriority(level: LogLevel): number {
  switch (level) {
    case 'error': return 4;
    case 'warn': return 3;
    case 'info': return 2;
    case 'debug': return 1;
    case 'success': return 0;
    default: return 0;
  }
}

/**
 * Строит граф (nodes + edges) из сырых логов одного requestId.
 *
 * Алгоритм: стековый подход по порядку timestamps.
 * - Новый сервис → request (push на стек)
 * - Возврат к сервису уже в стеке → response (pop до него)
 * - Повторный вызов (после pop) → новый request
 */
export function buildGraphFromLogs(logs: Log[]): RequestFlow {
  if (logs.length === 0) return { nodes: [], edges: [] };

  const sorted = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // ── Собираем уникальные сервисы и их worst level ──
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

  // ── Nodes ──
  const nodes: FlowNode[] = serviceOrder.map((name, i) => ({
    id: `n-${i}`,
    name,
    type: i === 0 ? 'client' as const : 'service' as const,
    status: worstLevel[name] === 'error' ? 'error' as const : 'success' as const,
  }));

  // ── Edges: один проход по sorted логам ──────────────────────────────────
  // serviceMsg обновляется на каждый лог → даёт "последнее сообщение" сервиса
  // Request label = serviceMsg[sender] (что отправитель делает)
  // Response label = serviceMsg[responder] (что ответчик ответил)

  const edges: FlowEdge[] = [];
  const stack: string[] = [];
  const requestTime: Record<string, number> = {};
  const serviceMsg: Record<string, string> = {};
  let edgeId = 0;
  let firstError = true;
  let prevService = '';

  for (const log of sorted) {
    const ts = new Date(log.timestamp).getTime();

    // Всегда обновляем последнее сообщение сервиса
    serviceMsg[log.service] = log.message;

    // Пропускаем если тот же сервис (нет перехода)
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
      // Сервис уже в стеке → response (pop до него)
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
          label: isErr ? serviceMsg[from] : (duration > 0 ? `${duration}ms` : undefined),
          isErrorSource: isErr && firstError ? true : undefined,
        });

        if (isErr && firstError) firstError = false;
      }
    } else {
      // Новый сервис → request
      // label = последнее сообщение ОТПРАВИТЕЛЯ (что он делает/куда шлёт)
      const sender = stack[stack.length - 1];

      edges.push({
        id: `e-${edgeId++}`,
        from: sender,
        to: log.service,
        type: 'request',
        timestamp: log.timestamp,
        status: 'success',
        label: serviceMsg[sender],
      });
      stack.push(log.service);
      requestTime[log.service] = ts;
    }
  }

  // ── Закрываем оставшийся стек (финальные response) ──
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
      label: isErr ? serviceMsg[from] : (duration > 0 ? `${duration}ms` : undefined),
      isErrorSource: isErr && firstError ? true : undefined,
    });

    if (isErr && firstError) firstError = false;
  }

  return { nodes, edges };
}

// ─── Build sequence for rendering ────────────────────────────────────────────

/**
 * Преобразует рёбра графа в массив SeqEvent для отрисовки.
 * Каждое ребро (FlowEdge) = одна стрелка на диаграмме.
 */
export function buildSequence(
  edges: FlowEdge[],
  services: string[],
): SeqEvent[] {
  if (edges.length === 0) return [];

  const colOf = (name: string): number => {
    const idx = services.indexOf(name);
    return idx !== -1 ? idx : 0;
  };

  return edges.map((edge) => ({
    id: edge.id,
    fromCol: colOf(edge.from),
    toCol: colOf(edge.to),
    label: edge.label || (edge.type === 'response'
      ? (edge.status === 'error' ? 'Error' : `${edge.duration ? edge.duration + 'ms' : 'OK'}`)
      : `→ ${edge.to}`),
    status: edge.status,
    duration: edge.duration,
    isResponse: edge.type === 'response',
    timestamp: edge.timestamp,
    isErrorSource: edge.isErrorSource,
  }));
}
