import { Box, Typography, alpha } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import type { FlowNode } from './types';

interface ErrorBannerProps {
  node: FlowNode;
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
      <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444' }}>
        Error at {node.name}
      </Typography>
    </Box>
  );
}
