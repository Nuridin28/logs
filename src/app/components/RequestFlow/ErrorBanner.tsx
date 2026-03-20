import { Box, Typography, alpha } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import type { FlowEdge, Log } from './types';
import { formatDuration } from './helpers';

interface ErrorBannerProps {
  edge: FlowEdge;
  log?: Log;
  isDark: boolean;
}

export default function ErrorBanner({ edge, log, isDark }: ErrorBannerProps) {
  return (
    <Box sx={{
      mb: 2, p: 1.5,
      bgcolor: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.04),
      border: `1px solid ${alpha('#ef4444', 0.3)}`,
      borderLeft: '4px solid #ef4444',
      borderRadius: '6px',
      display: 'flex', alignItems: 'center', gap: 1.5,
    }}>
      <ErrorIcon sx={{ fontSize: 18, color: '#ef4444' }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444' }}>
          Error at {edge.from}
          {edge.duration != null && (
            <Typography component="span" fontWeight={400} sx={{ color: '#ef4444', opacity: 0.7, ml: 1 }}>
              after {formatDuration(edge.duration)}
            </Typography>
          )}
        </Typography>
        {log && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
            {log.message.length > 120 ? log.message.slice(0, 120) + '...' : log.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
