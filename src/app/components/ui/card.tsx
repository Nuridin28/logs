import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

export default function Card({ children, sx, ...rest }: CardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
