import { Box, Button, alpha } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { formatTimestamp } from './helpers';
import LevelChip from './ui/LevelChip';
import MetaField from './ui/MetaField';
import type { Log } from './types';

interface DetailPanelProps {
  log: Log;
  color: string;
  isDark: boolean;
  onViewLog?: (logId: string) => void;
}

export default function DetailPanel({ log, color, isDark, onViewLog }: DetailPanelProps) {
  return (
    <Box sx={{
      mx: 2, my: 0.5, p: 2,
      bgcolor: isDark ? alpha(color, 0.05) : alpha(color, 0.025),
      border: `1px solid ${alpha(color, 0.15)}`,
      borderRadius: '6px',
    }}>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center',
      }}>
        <LevelChip level={log.level} size="small" iconSize={14} />
        <MetaField label="Service" value={log.service} />
        <MetaField label="Container" value={log.container} mono />
        <MetaField label="Host" value={log.host} mono />
        <MetaField label="Time" value={formatTimestamp(log.timestamp, { fractionalSeconds: true })} mono />
        <MetaField label="Message" value={log.message} />
        {onViewLog && (
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={() => onViewLog(log.id)}
            >
              Details
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
