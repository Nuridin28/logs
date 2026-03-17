import { Box, Typography } from '@mui/material';

interface FooterStatProps {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}

export default function FooterStat({ label, value, mono, color }: FooterStatProps) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: color || 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        fontFamily={mono ? 'monospace' : undefined}
        sx={{ color: color || 'text.primary' }}
      >
        {value}
      </Typography>
    </Box>
  );
}
