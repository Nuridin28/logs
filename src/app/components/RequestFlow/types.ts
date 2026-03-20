import type { ComponentType } from 'react';
import type { ChipProps, SvgIconProps } from '@mui/material';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export type NodeType = 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';
export type Status = 'success' | 'error' | 'pending';

export interface FlowNode {
  id: string;
  name: string;
  type: NodeType;
  status: Status;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response';
  timestamp: string;
  status: Status;
  duration?: number;
  label?: string;
  isErrorSource?: boolean;
  relatedLogId?: string;
}

export interface RequestFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
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

export interface SeqEvent {
  id: string;
  fromCol: number;
  toCol: number;
  label: string;
  status: Status;
  duration?: number;
  isResponse: boolean;
  timestamp: string;
  relatedLogId?: string;
  isErrorSource?: boolean;
}

export interface LevelConfigEntry {
  Icon: ComponentType<SvgIconProps>;
  color: ChipProps['color'];
}

export interface RequestFlowProps {
  requestId: string;
  logs: Log[];
  onViewLog?: (logId: string) => void;
}
