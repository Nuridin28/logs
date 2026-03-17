import type { ReactNode } from 'react';
import { Box, Typography, useTheme, type BoxProps } from '@mui/material';

interface StatCardProps {
  label: string;
  value: ReactNode;
  valueColor?: 'error' | 'success' | 'inherit';
  sx?: BoxProps['sx'];
}

export default function StatCard({ label, value, valueColor, sx }: StatCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ bgcolor: isDark ? 'grey.800' : 'grey.100', borderRadius: 1, p: 2, ...sx }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600} color={valueColor}>
        {value}
      </Typography>
    </Box>
  );
}
