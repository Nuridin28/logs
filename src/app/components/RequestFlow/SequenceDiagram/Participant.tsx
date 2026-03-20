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
  const StatusIcon = status === 'success' ? CheckCircle : status === 'error' ? ErrorIcon : Schedule;

  return (
    <Box sx={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      gap: 0.5, px: 1.5, py: 0.75,
      bgcolor: isDark ? alpha(borderCol, 0.1) : alpha(borderCol, 0.05),
      border: `1.5px solid ${borderCol}`, borderRadius: '8px',
      ...(status === 'error' && { boxShadow: `0 0 0 2px ${alpha('#ef4444', 0.15)}` }),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {Icon && <Icon sx={{ fontSize: 13, color: borderCol }} />}
        <Typography variant="caption" fontWeight={700} textAlign="center" noWrap
          sx={{ color: borderCol, fontSize: '0.68rem', maxWidth: COL_W - 50 }}>
          {name}
        </Typography>
      </Box>
      {status && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <StatusIcon sx={{ fontSize: 10, color: STATUS_COLORS[status] }} />
          <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 600, color: STATUS_COLORS[status] }}>
            {status}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
