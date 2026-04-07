import { SERVICE_COLORS } from './constants';
import type { FlowEdge, FlowNode, SeqEvent } from './types';

export const getColor = (i: number): string =>
  SERVICE_COLORS[i % SERVICE_COLORS.length];

export function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function deriveNodes(edges: FlowEdge[]): FlowNode[] {
  const seen = new Map<string, FlowNode>();
  const errorSources = new Set<string>();
  let idx = 0;

  for (const edge of edges) {
    if (edge.isErrorSource) errorSources.add(edge.from);
    for (const name of [edge.from, edge.to]) {
      if (!seen.has(name)) {
        seen.set(name, {
          id: `n-${idx++}`,
          name,
          type: idx === 1 ? 'client' : 'service',
          status: 'success',
        });
      }
    }
  }

  for (const name of errorSources) {
    const node = seen.get(name);
    if (node) node.status = 'error';
  }

  return Array.from(seen.values());
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
    label: edge.label || (edge.type === 'response'
      ? (edge.status === 'error' ? 'Error' : 'OK')
      : `→ ${edge.to}`),
    description: edge.description,
    status: edge.status,
    duration: edge.duration,
    isResponse: edge.type === 'response',
    isErrorSource: edge.isErrorSource,
  }));
}
