import React from 'react';
import { Typography, Box } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  );
}
