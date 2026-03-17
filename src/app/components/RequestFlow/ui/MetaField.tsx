import { Box, Typography } from '@mui/material';

interface MetaFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

export default function MetaField({ label, value, mono }: MetaFieldProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        fontFamily={mono ? 'monospace' : undefined}
        sx={{ fontSize: '0.78rem' }}
      >
        {value}
      </Typography>
    </Box>
  );
}
