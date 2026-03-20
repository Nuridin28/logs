import { Chip, type ChipProps } from '@mui/material';
import { LEVEL_CONFIG } from '../constants';
import type { LogLevel } from '../types';

interface LevelChipProps {
  level: LogLevel;
  size?: ChipProps['size'];
}

export default function LevelChip({ level, size = 'small' }: LevelChipProps) {
  const { Icon, color } = LEVEL_CONFIG[level];
  return (
    <Chip
      icon={<Icon sx={{ fontSize: 14 }} />}
      label={level.toUpperCase()}
      color={color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600 }}
    />
  );
}
