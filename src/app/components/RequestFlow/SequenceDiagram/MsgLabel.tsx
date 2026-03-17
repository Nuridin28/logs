import { Box, Typography, alpha } from '@mui/material';
import { ArrowForward, ArrowBack, Warning, ExpandMore, ExpandLess } from '@mui/icons-material';
import { COL_W } from '../constants';
import type { Status } from '../types';

interface MsgLabelProps {
  fromCol: number;
  toCol: number;
  label: string;
  isResponse: boolean;
  status: Status;
  duration?: number;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
  isErrorSource?: boolean;
}

export default function MsgLabel({
  fromCol, toCol, label, isResponse, status, duration,
  isExpanded, onToggle, isDark, isErrorSource,
}: MsgLabelProps) {
  const isSelf = fromCol === toCol;
  const isErr = status === 'error';

  let leftPx: number;
  let maxW: number;

  if (isSelf) {
    leftPx = toCol * COL_W + COL_W / 2 + 42;
    maxW = COL_W - 50;
  } else {
    const minC = Math.min(fromCol, toCol);
    const maxC = Math.max(fromCol, toCol);
    leftPx = minC * COL_W + COL_W / 2 + ((maxC - minC) * COL_W) / 2;
    maxW = (maxC - minC) * COL_W - 30;
  }

  const borderColor = isErr ? '#ef4444' : isResponse ? '#94a3b8' : '#3b82f6';

  return (
    <Box
      onClick={onToggle}
      sx={{
        position: 'absolute',
        left: leftPx,
        top: isResponse ? undefined : 4,
        bottom: isResponse ? 4 : undefined,
        transform: isSelf ? 'translateX(-30%)' : 'translateX(-50%)',
        zIndex: 5, cursor: 'pointer',
        px: 1, py: 0.25,
        bgcolor: isErr
          ? (isDark ? alpha('#ef4444', 0.12) : alpha('#ef4444', 0.06))
          : (isDark ? 'background.paper' : '#fff'),
        borderRadius: '4px',
        border: `1px solid ${alpha(borderColor, isErr ? 0.5 : 0.3)}`,
        maxWidth: Math.max(maxW, 100),
        display: 'flex', alignItems: 'center', gap: 0.5,
        boxShadow: isErrorSource
          ? `0 0 0 2px ${alpha('#ef4444', 0.3)}, 0 2px 8px ${alpha('#ef4444', 0.2)}`
          : `0 1px 3px ${alpha('#000', 0.06)}`,
        transition: 'all 0.15s',
        '&:hover': {
          borderColor,
          bgcolor: isErr
            ? (isDark ? alpha('#ef4444', 0.18) : alpha('#ef4444', 0.1))
            : (isDark ? alpha(borderColor, 0.08) : alpha(borderColor, 0.04)),
          boxShadow: `0 2px 8px ${alpha(borderColor, 0.18)}`,
        },
      }}
    >
      {!isSelf && (
        isResponse
          ? <ArrowBack sx={{ fontSize: 12, color: borderColor, flexShrink: 0 }} />
          : <ArrowForward sx={{ fontSize: 12, color: borderColor, flexShrink: 0 }} />
      )}
      {isErr && <Warning sx={{ fontSize: 12, color: '#ef4444', flexShrink: 0 }} />}
      <Typography variant="caption" fontWeight={isErr ? 700 : 600} noWrap
        sx={{
          fontSize: '0.66rem',
          color: isErr ? '#ef4444' : (isDark ? '#e2e8f0' : '#334155'),
          fontStyle: isResponse ? 'italic' : 'normal',
        }}>
        {label}
      </Typography>
      {duration != null && isResponse && !isErr && (
        <Typography variant="caption" sx={{
          fontSize: '0.6rem', color: 'text.secondary', fontFamily: 'monospace', flexShrink: 0,
        }}>
          {duration}ms
        </Typography>
      )}
      {isExpanded
        ? <ExpandLess sx={{ fontSize: 13, color: 'text.secondary', flexShrink: 0 }} />
        : <ExpandMore sx={{ fontSize: 13, color: 'text.secondary', flexShrink: 0 }} />}
    </Box>
  );
}
