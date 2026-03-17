import React, { type ComponentType } from 'react';
import {
  Error as ErrorIcon,
  Warning,
  Info as InfoIcon,
  CheckCircle,
  BugReport,
} from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { LogLevel } from '../../utils/mockLogs';

const levelConfig: Record<LogLevel, { Icon: ComponentType<{ sx?: object }>; color: ChipProps['color'] }> = {
  error: { Icon: ErrorIcon, color: 'error' },
  warn: { Icon: Warning, color: 'warning' },
  info: { Icon: InfoIcon, color: 'info' },
  success: { Icon: CheckCircle, color: 'success' },
  debug: { Icon: BugReport, color: 'default' },
};

interface LevelChipProps {
  level: LogLevel;
  size?: ChipProps['size'];
  iconSize?: number;
}

export default function LevelChip({ level, size = 'small', iconSize = 16 }: LevelChipProps) {
  const config = levelConfig[level];
  const Icon = config.Icon;
  const icon = <Icon sx={{ fontSize: iconSize }} />;
  return (
    <Chip
      icon={icon}
      label={level.toUpperCase()}
      color={config.color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );
}
