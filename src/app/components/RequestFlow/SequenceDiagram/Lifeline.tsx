import { Box, alpha } from '@mui/material';
import { COL_W } from '../constants';

interface LifelineProps {
  color: string;
  isError: boolean;
  isActive: boolean;
  isDark: boolean;
}

export default function Lifeline({ color, isError, isActive, isDark }: LifelineProps) {
  const c = isError ? '#ef4444' : color;

  return (
    <Box sx={{ width: COL_W, minWidth: COL_W, height: '100%', position: 'relative' }}>
      <Box sx={{
        position: 'absolute', top: 0, bottom: 0, left: '50%', width: 0,
        borderLeft: `1.5px dashed ${alpha(c, isDark ? 0.2 : 0.15)}`,
        transform: 'translateX(-0.75px)', zIndex: 1,
      }} />
      {isActive && (
        <Box sx={{
          position: 'absolute', top: 4, bottom: 4, left: '50%', width: 10,
          transform: 'translateX(-5px)',
          bgcolor: isDark ? alpha(c, 0.2) : alpha(c, 0.1),
          border: `1.5px solid ${alpha(c, 0.35)}`,
          borderRadius: '3px', zIndex: 2,
        }} />
      )}
    </Box>
  );
}
