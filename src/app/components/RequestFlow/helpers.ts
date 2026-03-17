import { SERVICE_COLORS } from './constants';
import type { RequestFlowNode, SeqEvent } from './types';

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

export function buildSequence(
  flow: RequestFlowNode[],
  services: string[],
): SeqEvent[] {
  if (flow.length < 2) return [];

  const colOf = (name: string): number => {
    const idx = services.indexOf(name);
    return idx !== -1 ? idx : 0;
  };

  const events: SeqEvent[] = [];

  // Forward (request) arrows
  for (let i = 0; i < flow.length - 1; i++) {
    const from = flow[i];
    const to = flow[i + 1];
    events.push({
      id: `fwd-${i}`,
      fromCol: colOf(from.name),
      toCol: colOf(to.name),
      label: from.details || `→ ${to.name}`,
      status: to.status === 'error' && i === flow.length - 2 ? 'error' : 'success',
      isResponse: false,
      timestamp: to.timestamp,
    });
  }

  // Find last error index
  let errorIdx = -1;
  for (let j = flow.length - 1; j >= 0; j--) {
    if (flow[j].status === 'error') {
      errorIdx = j;
      break;
    }
  }

  // Return (response) arrows
  for (let i = flow.length - 1; i >= 1; i--) {
    const from = flow[i];
    const to = flow[i - 1];
    const isErr = from.status === 'error' || (errorIdx >= 0 && i >= errorIdx);

    events.push({
      id: `ret-${i}`,
      fromCol: colOf(from.name),
      toCol: colOf(to.name),
      label: isErr
        ? (from.status === 'error' ? from.details || 'Error' : 'Error propagated')
        : `${from.duration ? from.duration + 'ms' : 'OK'}`,
      details: from.details,
      status: isErr ? 'error' : 'success',
      duration: from.duration,
      isResponse: true,
      timestamp: from.timestamp,
      isErrorSource: i === errorIdx,
    });
  }

  return events;
}
