import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';
import {
  Storage,
  Error as ErrorIcon,
  Smartphone,
  Dns,
  Hub,
  Cloud,
  Memory,
  Warning,
  CheckCircle,
  Info as InfoIcon,
  BugReport,
} from '@mui/icons-material';

import type { LogLevel, NodeType, Status, LevelConfigEntry } from './types';

// ─── Layout ──────────────────────────────────────────────────────────────────

export const COL_W = 160;
export const TS_W = 80;
export const ROW_H = 64;

// ─── Colors ──────────────────────────────────────────────────────────────────

export const SERVICE_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#db2777', '#4f46e5', '#0d9488', '#ca8a04',
] as const;

export const STATUS_COLORS: Record<Status, string> = {
  success: '#22c55e',
  error: '#ef4444',
  pending: '#f59e0b',
};

export const LEVEL_COLORS: Record<LogLevel, string> = {
  error: '#ef4444',
  warn: '#f59e0b',
  info: '#3b82f6',
  success: '#22c55e',
  debug: '#8b5cf6',
};

// ─── Icon / chip configs ─────────────────────────────────────────────────────

export const LEVEL_CONFIG: Record<LogLevel, LevelConfigEntry> = {
  error: { Icon: ErrorIcon, color: 'error' },
  warn: { Icon: Warning, color: 'warning' },
  info: { Icon: InfoIcon, color: 'info' },
  success: { Icon: CheckCircle, color: 'success' },
  debug: { Icon: BugReport, color: 'default' },
};

export const TYPE_ICONS: Record<NodeType, ComponentType<SvgIconProps>> = {
  client: Smartphone,
  gateway: Hub,
  service: Dns,
  database: Storage,
  external: Cloud,
  cache: Memory,
};
