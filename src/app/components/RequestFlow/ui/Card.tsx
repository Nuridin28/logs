import { Box, type BoxProps } from '@mui/material';

export default function Card({ children, sx, ...rest }: BoxProps) {
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
