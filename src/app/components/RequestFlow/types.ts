import type { ComponentType } from 'react';
import type { ChipProps, SvgIconProps } from '@mui/material';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export type NodeType = 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';
export type Status = 'success' | 'error' | 'pending';

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

export interface RequestFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
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
  timestamp: string;
  isErrorSource?: boolean;
}

export interface LevelConfigEntry {
  Icon: ComponentType<SvgIconProps>;
  color: ChipProps['color'];
}

export interface Log {
  id: string;
  timestamp: string;
  container: string;
  service: string;
  level: LogLevel;
  message: string;
  host: string;
  requestId?: string;
}

export interface RequestFlowProps {
  requestId: string;
  edges: FlowEdge[];
  onViewLog?: (edgeId: string) => void;
}
