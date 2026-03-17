import { SERVICE_COLORS } from './constants';
import type { FlowEdge, SeqEvent } from './types';

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
