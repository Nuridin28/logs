import { Box, Typography, Button } from '@mui/material';
import React, { type ComponentType } from 'react';

interface EmptyStateProps {
  icon: ComponentType<{ sx?: object }>;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  iconSize?: number;
}

export default function EmptyState({ icon: Icon, title, description, action, iconSize = 64 }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Icon sx={{ fontSize: iconSize, color: 'text.disabled', mb: 1 }} />
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
        {description}
      </Typography>
      {action}
    </Box>
  );
}
