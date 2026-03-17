import { Box, Typography, alpha } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Schedule } from '@mui/icons-material';
import { COL_W, STATUS_COLORS, TYPE_ICONS } from '../constants';
import type { NodeType, Status } from '../types';

interface ParticipantProps {
  name: string;
  color: string;
  type?: NodeType;
  status?: Status;
  isDark: boolean;
}

export default function Participant({ name, color, type, status, isDark }: ParticipantProps) {
  const Icon = type ? TYPE_ICONS[type] : null;
  const borderCol = status === 'error' ? '#ef4444' : color;

  return (
    <Box sx={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      gap: 0.25, px: 1.5, py: 0.75, position: 'relative',
      bgcolor: isDark ? alpha(borderCol, 0.1) : alpha(borderCol, 0.05),
      border: `1.5px solid ${borderCol}`, borderRadius: '6px',
      ...(status === 'error' && { boxShadow: `0 0 0 2px ${alpha('#ef4444', 0.2)}` }),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {Icon && <Icon sx={{ fontSize: 14, color: borderCol }} />}
        <Typography variant="caption" fontWeight={700} textAlign="center"
          sx={{ color: borderCol, lineHeight: 1.2, fontSize: '0.7rem', maxWidth: COL_W - 40 }}>
          {name}
        </Typography>
      </Box>
      {status && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: STATUS_COLORS[status], fontSize: '0.6rem' }}>
          {status === 'success' && <CheckCircle sx={{ fontSize: 10 }} />}
          {status === 'error' && <ErrorIcon sx={{ fontSize: 10 }} />}
          {status === 'pending' && <Schedule sx={{ fontSize: 10 }} />}
          <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'inherit' }}>
            {status}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
