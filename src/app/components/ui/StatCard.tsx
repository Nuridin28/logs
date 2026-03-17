import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  valueColor?: 'error' | 'success' | 'inherit';
  sx?: object;
}

export default function StatCard({ label, value, valueColor, sx }: StatCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        bgcolor: isDark ? 'grey.800' : 'grey.100',
        borderRadius: 1,
        p: 2,
        ...sx,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={600}
        color={valueColor}
      >
        {value}
      </Typography>
    </Box>
  );
}
