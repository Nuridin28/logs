import type { ComponentType } from 'react';
import type { ChipProps, SvgIconProps } from '@mui/material';

// ─── Domain types ────────────────────────────────────────────────────────────

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export type NodeType = 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';
export type Status = 'success' | 'error' | 'pending';

// ─── Data models ─────────────────────────────────────────────────────────────

export interface Log {
  id: string;
  timestamp: string;
  container: string;
  service: string;
  level: LogLevel;
  message: string;
  host: string;
  requestId?: string;
  requestFlow?: RequestFlowNode[];
}

export interface RequestFlowNode {
  id: string;
  name: string;
  type: NodeType;
  timestamp: string;
  status: Status;
  duration?: number;
  details?: string;
}

// ─── Sequence diagram ────────────────────────────────────────────────────────

export interface SeqEvent {
  id: string;
  fromCol: number;
  toCol: number;
  label: string;
  details?: string;
  status: Status;
  duration?: number;
  isResponse: boolean;
  timestamp: string;
  relatedLog?: Log;
  isErrorSource?: boolean;
}

// ─── Config records ──────────────────────────────────────────────────────────

export interface LevelConfigEntry {
  Icon: ComponentType<SvgIconProps>;
  color: ChipProps['color'];
}

// ─── Component props ─────────────────────────────────────────────────────────

export interface RequestFlowProps {
  requestId: string;
  logs: Log[];
  /** Called when user clicks "View" on a log entry. */
  onViewLog?: (logId: string) => void;
}
