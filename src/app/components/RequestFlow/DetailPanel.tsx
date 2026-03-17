import { Box, Typography, Button, alpha } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { LEVEL_COLORS } from './constants';
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
  const hasSteps = log.steps.length > 0;

  return (
    <Box sx={{
      mx: 2, my: 0.5, p: 2,
      bgcolor: isDark ? alpha(color, 0.05) : alpha(color, 0.025),
      border: `1px solid ${alpha(color, 0.15)}`,
      borderRadius: '6px',
    }}>
      {/* Meta row */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        mb: hasSteps ? 1.5 : 0,
        pb: hasSteps ? 1.5 : 0,
        borderBottom: hasSteps ? `1px solid ${alpha(color, 0.12)}` : 'none',
        alignItems: 'center',
      }}>
        <MetaField label="Service" value={log.service} />
        <MetaField label="Container" value={log.container} mono />
        <MetaField label="Host" value={log.host} mono />
        <MetaField label="Time" value={formatTimestamp(log.timestamp, { fractionalSeconds: true })} mono />
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

      {/* Steps timeline */}
      {hasSteps && (
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary"
            sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.62rem' }}>
            Steps ({log.steps.length})
          </Typography>
          {log.steps.map((step, i) => {
            const sc = LEVEL_COLORS[step.level];
            const isLast = i === log.steps.length - 1;
            return (
              <Box key={step.id} sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
                  <Box sx={{
                    width: 8, height: 8, borderRadius: '50%', bgcolor: sc,
                    flexShrink: 0, boxShadow: `0 0 0 3px ${alpha(sc, 0.18)}`,
                  }} />
                  {!isLast && <Box sx={{ width: 1.5, flex: 1, bgcolor: alpha(sc, 0.18), my: 0.25 }} />}
                </Box>
                <Box sx={{ pb: isLast ? 0 : 1.5, flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="caption" fontFamily="monospace" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                      {formatTimestamp(step.timestamp, { fractionalSeconds: true })}
                    </Typography>
                    <LevelChip level={step.level} size="small" iconSize={12} />
                  </Box>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25, fontSize: '0.8rem' }}>
                    {step.message}
                  </Typography>
                  {step.details && (
                    <Typography variant="caption" fontFamily="monospace" sx={{
                      display: 'block',
                      bgcolor: isDark ? alpha('#000', 0.3) : alpha('#000', 0.04),
                      px: 1.5, py: 0.5, borderRadius: 1, wordBreak: 'break-all',
                      color: 'text.secondary', lineHeight: 1.5, fontSize: '0.62rem',
                    }}>
                      {step.details}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
