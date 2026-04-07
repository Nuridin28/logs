export type Status = 'success' | 'error' | 'pending';
export type NodeType = 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  description?: string;
  type: 'request' | 'response';
  status: Status;
  duration?: number;
  isErrorSource?: boolean;
}

export interface FlowNode {
  id: string;
  name: string;
  type: NodeType;
  status: Status;
}

export interface SeqEvent {
  id: string;
  fromCol: number;
  toCol: number;
  label: string;
  description?: string;
  status: Status;
  duration?: number;
  isResponse: boolean;
  isErrorSource?: boolean;
}

export interface RequestFlowProps {
  requestId: string;
  edges: FlowEdge[];
  onViewLog?: (edgeId: string) => void;
}
