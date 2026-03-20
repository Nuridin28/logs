import type { ComponentType, ReactNode } from 'react';
import { Box, Typography, type SvgIconProps } from '@mui/material';

interface EmptyStateProps {
  icon: ComponentType<SvgIconProps>;
  title: string;
  description: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
      <Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
  );
}
