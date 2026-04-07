import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';
import { Smartphone, Dns, Hub, Cloud, Memory, Storage } from '@mui/icons-material';
import type { NodeType, Status } from './types';

export const COL_W = 180;
export const TS_W = 80;
export const ROW_H = 68;

export const SERVICE_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#db2777', '#4f46e5', '#0d9488', '#ca8a04',
] as const;

export const STATUS_COLORS: Record<Status, string> = {
  success: '#22c55e',
  error: '#ef4444',
  pending: '#f59e0b',
};

export const TYPE_ICONS: Record<NodeType, ComponentType<SvgIconProps>> = {
  client: Smartphone,
  gateway: Hub,
  service: Dns,
  database: Storage,
  external: Cloud,
  cache: Memory,
};
