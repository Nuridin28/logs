import { Box, Typography, Button, Chip, alpha } from '@mui/material';
import { ContentCopy, Visibility } from '@mui/icons-material';
import { formatTimestamp } from './helpers';
import { LEVEL_CONFIG, LEVEL_COLORS } from './constants';
import type { Log } from './types';

interface DetailPanelProps {
  log: Log;
  color: string;
  isDark: boolean;
  onViewLog?: (logId: string) => void;
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        fontFamily={mono ? 'monospace' : undefined}
        sx={{ fontSize: '0.78rem', wordBreak: 'break-word' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function DetailPanel({ log, color, isDark, onViewLog }: DetailPanelProps) {
  const { Icon, color: chipColor } = LEVEL_CONFIG[log.level];
  const levelColor = LEVEL_COLORS[log.level];

  const handleCopy = () => {
    const text = `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.service}] [${log.container}] ${log.message}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{
      mx: 2, my: 0.5, p: 2,
      bgcolor: isDark ? alpha(color, 0.04) : alpha(color, 0.02),
      border: `1px solid ${alpha(color, 0.12)}`,
      borderRadius: '6px',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Chip
          icon={<Icon sx={{ fontSize: 14 }} />}
          label={log.level.toUpperCase()}
          color={chipColor}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
        />
        <Typography variant="caption" fontFamily="monospace" sx={{ color: levelColor, fontWeight: 600 }}>
          {formatTimestamp(log.timestamp, { fractionalSeconds: true })}
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
          <Button size="small" startIcon={<ContentCopy />} onClick={handleCopy}
            sx={{ textTransform: 'none', fontSize: '0.7rem', minWidth: 0, color: 'text.secondary' }}>
            Copy
          </Button>
          {onViewLog && (
            <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={() => onViewLog(log.id)}
              sx={{ textTransform: 'none', fontSize: '0.7rem', minWidth: 0 }}>
              Full log
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
        <Field label="Service" value={log.service} />
        <Field label="Container" value={log.container} mono />
        <Field label="Host" value={log.host} mono />
      </Box>

      <Box sx={{
        mt: 1.5, p: 1.5, borderRadius: '4px',
        bgcolor: isDark ? alpha('#000', 0.3) : alpha('#000', 0.03),
        border: `1px solid ${isDark ? alpha('#fff', 0.06) : alpha('#000', 0.06)}`,
      }}>
        <Typography variant="body2" fontFamily="monospace" sx={{
          fontSize: '0.75rem', lineHeight: 1.6, wordBreak: 'break-word',
          color: log.level === 'error' ? '#ef4444' : log.level === 'warn' ? '#f59e0b' : 'text.primary',
        }}>
          {log.message}
        </Typography>
      </Box>
    </Box>
  );
}
