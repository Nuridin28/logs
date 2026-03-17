import { Box, Typography, alpha } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import type { RequestFlowNode } from './types';

interface ErrorBannerProps {
  node: RequestFlowNode;
  isDark: boolean;
}

export default function ErrorBanner({ node, isDark }: ErrorBannerProps) {
  return (
    <Box sx={{
      mx: 2, my: 1, p: 1.5,
      bgcolor: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.04),
      border: `1px solid ${alpha('#ef4444', 0.3)}`,
      borderLeft: '4px solid #ef4444',
      borderRadius: '6px',
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
    }}>
      <ErrorIcon sx={{ fontSize: 18, color: '#ef4444', mt: 0.25 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444', mb: 0.25 }}>
          Error at {node.name}
        </Typography>
        <Typography variant="caption" fontFamily="monospace" sx={{
          display: 'block', color: isDark ? '#fca5a5' : '#991b1b',
          wordBreak: 'break-word', lineHeight: 1.5, fontSize: '0.7rem',
        }}>
          {node.details}
        </Typography>
        {node.duration != null && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', mt: 0.5, display: 'block' }}>
            Duration: {node.duration}ms
          </Typography>
        )}
      </Box>
    </Box>
  );
}
