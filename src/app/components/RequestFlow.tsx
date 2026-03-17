import React, { useState, useMemo, type ComponentType, type ReactNode } from 'react';
import {
  Storage,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
  Smartphone,
  Dns,
  Hub,
  Cloud,
  Memory,
  ArrowForward,
  ArrowBack,
  Warning,
  CheckCircle,
  Schedule,
  Info as InfoIcon,
  BugReport,
  Visibility,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Chip,
  Collapse,
  useTheme,
  alpha,
  type BoxProps,
  type ChipProps,
  type SvgIconProps,
} from '@mui/material';

// ─── Types ──────────────────────────────────────────────────────────────────

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
type NodeType = 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';
type Status = 'success' | 'error' | 'pending';

interface LogStep {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
  details?: string;
}

interface Log {
  id: string;
  timestamp: string;
  container: string;
  service: string;
  level: LogLevel;
  message: string;
  host: string;
  requestId?: string;
  steps: LogStep[];
  requestFlow?: RequestFlowNode[];
}

interface RequestFlowNode {
  id: string;
  name: string;
  type: NodeType;
  timestamp: string;
  status: Status;
  duration?: number;
  details?: string;
}

interface SeqEvent {
  id: string;
  fromCol: number;
  toCol: number;
  label: string;
  details?: string;
  status: Status;
  duration?: number;
  isResponse: boolean;
  timestamp: string;
  relatedLog?: Log;
  isErrorSource?: boolean;
}

export interface RequestFlowProps {
  requestId: string;
  logs: Log[];
  /** Called when user clicks "View" on a log entry. */
  onViewLog?: (logId: string) => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SERVICE_COLORS = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#db2777', '#4f46e5', '#0d9488', '#ca8a04',
] as const;

const STATUS_COLORS: Record<Status, string> = {
  success: '#22c55e',
  error: '#ef4444',
  pending: '#f59e0b',
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  error: '#ef4444',
  warn: '#f59e0b',
  info: '#3b82f6',
  success: '#22c55e',
  debug: '#8b5cf6',
};

const LEVEL_CONFIG: Record<LogLevel, { Icon: ComponentType<SvgIconProps>; color: ChipProps['color'] }> = {
  error: { Icon: ErrorIcon, color: 'error' },
  warn: { Icon: Warning, color: 'warning' },
  info: { Icon: InfoIcon, color: 'info' },
  success: { Icon: CheckCircle, color: 'success' },
  debug: { Icon: BugReport, color: 'default' },
};

const TYPE_ICONS: Record<NodeType, ComponentType<SvgIconProps>> = {
  client: Smartphone,
  gateway: Hub,
  service: Dns,
  database: Storage,
  external: Cloud,
  cache: Memory,
};

const COL_W = 160;
const TS_W = 80;
const ROW_H = 64;

// ─── Helpers ────────────────────────────────────────────────────────────────

const getColor = (i: number) => SERVICE_COLORS[i % SERVICE_COLORS.length];

function formatTimestamp(
  timestamp: string,
  options?: { includeYear?: boolean; fractionalSeconds?: boolean },
): string {
  const date = new Date(timestamp);
  if (options?.fractionalSeconds) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false,
    });
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(options?.includeYear && { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function buildSequence(flow: RequestFlowNode[], services: string[]): SeqEvent[] {
  if (flow.length < 2) return [];

  const colOf = (name: string) => {
    const idx = services.indexOf(name);
    return idx !== -1 ? idx : 0;
  };

  const events: SeqEvent[] = [];

  for (let i = 0; i < flow.length - 1; i++) {
    const from = flow[i];
    const to = flow[i + 1];
    events.push({
      id: `fwd-${i}`,
      fromCol: colOf(from.name),
      toCol: colOf(to.name),
      label: from.details || `→ ${to.name}`,
      status: to.status === 'error' && i === flow.length - 2 ? 'error' : 'success',
      isResponse: false,
      timestamp: to.timestamp,
    });
  }

  const errorIdx = flow.findLastIndex((n) => n.status === 'error');

  for (let i = flow.length - 1; i >= 1; i--) {
    const from = flow[i];
    const to = flow[i - 1];
    const isErr = from.status === 'error' || (errorIdx >= 0 && i >= errorIdx);
    events.push({
      id: `ret-${i}`,
      fromCol: colOf(from.name),
      toCol: colOf(to.name),
      label: isErr
        ? (from.status === 'error' ? from.details || 'Error' : 'Error propagated')
        : `${from.duration ? from.duration + 'ms' : 'OK'}`,
      details: from.details,
      status: isErr ? 'error' : 'success',
      duration: from.duration,
      isResponse: true,
      timestamp: from.timestamp,
      isErrorSource: i === errorIdx,
    });
  }

  return events;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function LevelChip({ level, size = 'small', iconSize = 16 }: {
  level: LogLevel;
  size?: ChipProps['size'];
  iconSize?: number;
}) {
  const { Icon, color } = LEVEL_CONFIG[level];
  return (
    <Chip
      icon={<Icon sx={{ fontSize: iconSize }} />}
      label={level.toUpperCase()}
      color={color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );
}

function Card({ children, sx, ...rest }: BoxProps) {
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

function StatCard({ label, value, valueColor, sx }: {
  label: string;
  value: ReactNode;
  valueColor?: 'error' | 'success' | 'inherit';
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ bgcolor: isDark ? 'grey.800' : 'grey.100', borderRadius: 1, p: 2, ...sx }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600} color={valueColor}>
        {value}
      </Typography>
    </Box>
  );
}

function EmptyState({ icon: Icon, title, description }: {
  icon: ComponentType<SvgIconProps>;
  title: string;
  description: ReactNode;
}) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
      <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 1 }} />
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  );
}

function Participant({ name, color, type, status, isDark }: {
  name: string;
  color: string;
  type?: NodeType;
  status?: Status;
  isDark: boolean;
}) {
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

function SvgArrow({ fromCol, toCol, totalCols, isResponse, status }: {
  fromCol: number;
  toCol: number;
  totalCols: number;
  isResponse: boolean;
  status: Status;
}) {
  const isSelf = fromCol === toCol;
  const w = totalCols * COL_W;
  const y = ROW_H / 2;
  const color = status === 'error' ? '#ef4444' : status === 'pending' ? '#f59e0b' : '#94a3b8';

  if (isSelf) {
    const cx = fromCol * COL_W + COL_W / 2;
    return (
      <svg width={w} height={ROW_H}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}>
        <path d={`M ${cx + 6} ${y - 12} H ${cx + 30} V ${y + 12} H ${cx + 6}`}
          fill="none" stroke={color} strokeWidth={1.5}
          strokeDasharray={isResponse ? '5 3' : undefined} />
        <polygon points={`${cx + 6},${y + 12} ${cx + 12},${y + 8} ${cx + 12},${y + 16}`} fill={color} />
      </svg>
    );
  }

  const fromX = fromCol * COL_W + COL_W / 2;
  const toX = toCol * COL_W + COL_W / 2;
  const dir = toX > fromX ? 1 : -1;
  const x1 = fromX + dir * 6;
  const x2 = toX - dir * 6;

  return (
    <svg width={w} height={ROW_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}>
      <line x1={x1} y1={y} x2={x2 - dir * 7} y2={y}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={isResponse ? '6 3' : undefined} />
      <polygon
        points={dir > 0
          ? `${x2},${y} ${x2 - 7},${y - 4} ${x2 - 7},${y + 4}`
          : `${x2},${y} ${x2 + 7},${y - 4} ${x2 + 7},${y + 4}`}
        fill={color} />
      <circle cx={fromX} cy={y} r={3} fill={color} />
    </svg>
  );
}

function MsgLabel({ fromCol, toCol, label, isResponse, status, duration, isExpanded, onToggle, isDark, isErrorSource }: {
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
}) {
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

function ErrorBanner({ node, isDark }: { node: RequestFlowNode; isDark: boolean }) {
  return (
    <Box sx={{
      mx: 2, my: 1, p: 1.5,
      bgcolor: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.04),
      border: `1px solid ${alpha('#ef4444', 0.3)}`,
      borderLeft: '4px solid #ef4444',
      borderRadius: '6px',
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
    }}>
      <ErrorIcon sx={{ fontSize: 18, color: '#ef4444', mt: 0.25 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#ef4444', mb: 0.25 }}>
          Error at {node.name}
        </Typography>
        <Typography variant="caption" fontFamily="monospace" sx={{
          display: 'block', color: isDark ? '#fca5a5' : '#991b1b',
          wordBreak: 'break-word', lineHeight: 1.5, fontSize: '0.7rem',
        }}>
          {node.details}
        </Typography>
        {node.duration != null && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', mt: 0.5, display: 'block' }}>
            Duration: {node.duration}ms
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function DetailPanel({ log, color, isDark, onViewLog }: {
  log: Log;
  color: string;
  isDark: boolean;
  onViewLog?: (logId: string) => void;
}) {
  return (
    <Box sx={{
      mx: 2, my: 0.5, p: 2,
      bgcolor: isDark ? alpha(color, 0.05) : alpha(color, 0.025),
      border: `1px solid ${alpha(color, 0.15)}`,
      borderRadius: '6px',
    }}>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        mb: log.steps.length > 0 ? 1.5 : 0,
        pb: log.steps.length > 0 ? 1.5 : 0,
        borderBottom: log.steps.length > 0 ? `1px solid ${alpha(color, 0.12)}` : 'none',
        alignItems: 'center',
      }}>
        <MetaField label="Service" value={log.service} />
        <MetaField label="Container" value={log.container} mono />
        <MetaField label="Host" value={log.host} mono />
        <MetaField label="Time" value={formatTimestamp(log.timestamp, { fractionalSeconds: true })} mono />
        {onViewLog && (
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={() => onViewLog(log.id)}
            >
              Details
            </Button>
          </Box>
        )}
      </Box>

      {log.steps.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary"
            sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.62rem' }}>
            Steps ({log.steps.length})
          </Typography>
          {log.steps.map((step, i) => {
            const sc = LEVEL_COLORS[step.level];
            const isLast = i === log.steps.length - 1;
            return (
              <Box key={step.id} sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: sc, flexShrink: 0, boxShadow: `0 0 0 3px ${alpha(sc, 0.18)}` }} />
                  {!isLast && <Box sx={{ width: 1.5, flex: 1, bgcolor: alpha(sc, 0.18), my: 0.25 }} />}
                </Box>
                <Box sx={{ pb: isLast ? 0 : 1.5, flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="caption" fontFamily="monospace" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                      {formatTimestamp(step.timestamp, { fractionalSeconds: true })}
                    </Typography>
                    <LevelChip level={step.level} size="small" iconSize={12} />
                  </Box>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25, fontSize: '0.8rem' }}>
                    {step.message}
                  </Typography>
                  {step.details && (
                    <Typography variant="caption" fontFamily="monospace" sx={{
                      display: 'block', bgcolor: isDark ? alpha('#000', 0.3) : alpha('#000', 0.04),
                      px: 1.5, py: 0.5, borderRadius: 1, wordBreak: 'break-all',
                      color: 'text.secondary', lineHeight: 1.5, fontSize: '0.62rem',
                    }}>
                      {step.details}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function MetaField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>{label}</Typography>
      <Typography variant="body2" fontWeight={500} fontFamily={mono ? 'monospace' : undefined} sx={{ fontSize: '0.78rem' }}>
        {value}
      </Typography>
    </Box>
  );
}

function FooterStat({ label, value, mono, color }: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: color || 'text.secondary' }}>{label}</Typography>
      <Typography variant="body2" fontWeight={700} fontFamily={mono ? 'monospace' : undefined}
        sx={{ color: color || 'text.primary' }}>{value}</Typography>
    </Box>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function RequestFlow({ requestId, logs, onViewLog }: RequestFlowProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const requestLogs = useMemo(
    () =>
      logs
        .filter((log) => log.requestId === requestId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [logs, requestId],
  );

  const primaryLog = useMemo(
    () => requestLogs.find((l) => l.requestFlow && l.requestFlow.length > 0),
    [requestLogs],
  );

  const flow = primaryLog?.requestFlow ?? [];

  const services = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const node of flow) {
      if (!seen.has(node.name)) {
        seen.add(node.name);
        result.push(node.name);
      }
    }
    return result;
  }, [flow]);

  const serviceTypes = useMemo(() => {
    const map: Record<string, NodeType> = {};
    for (const n of flow) map[n.name] = n.type;
    return map;
  }, [flow]);

  const serviceStatuses = useMemo(() => {
    const map: Record<string, Status> = {};
    for (const n of flow) map[n.name] = n.status;
    return map;
  }, [flow]);

  const seqEvents = useMemo(() => buildSequence(flow, services), [flow, services]);

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    for (const e of seqEvents) next[e.id] = true;
    setExpanded(next);
  };

  const collapseAll = () => setExpanded({});

  const totalDuration = useMemo(() => {
    if (requestLogs.length < 2) return 0;
    return new Date(requestLogs[requestLogs.length - 1].timestamp).getTime()
      - new Date(requestLogs[0].timestamp).getTime();
  }, [requestLogs]);

  const errorCount = requestLogs.filter((l) => l.level === 'error').length;
  const warnCount = requestLogs.filter((l) => l.level === 'warn').length;
  const errorNode = flow.find((n) => n.status === 'error');

  if (requestLogs.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <EmptyState
          icon={ErrorIcon}
          title="Request Not Found"
          description={
            <>No logs found for request ID: <Typography component="span" fontFamily="monospace" fontWeight={600}>{requestId}</Typography></>
          }
        />
      </Box>
    );
  }

  const totalW = TS_W + services.length * COL_W;

  const renderLifelines = (activeCol?: number) =>
    services.map((s, i) => {
      const c = getColor(i);
      const isErr = serviceStatuses[s] === 'error';
      const active = i === activeCol;
      return (
        <Box key={i} sx={{ width: COL_W, minWidth: COL_W, height: '100%', position: 'relative' }}>
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, left: '50%', width: 0,
            borderLeft: `1.5px dashed ${alpha(isErr ? '#ef4444' : c, isDark ? 0.2 : 0.15)}`,
            transform: 'translateX(-0.75px)', zIndex: 1,
          }} />
          {active && (
            <Box sx={{
              position: 'absolute', top: 4, bottom: 4, left: '50%', width: 10,
              transform: 'translateX(-5px)',
              bgcolor: isDark ? alpha(isErr ? '#ef4444' : c, 0.2) : alpha(isErr ? '#ef4444' : c, 0.1),
              border: `1.5px solid ${alpha(isErr ? '#ef4444' : c, 0.35)}`,
              borderRadius: '3px', zIndex: 2,
            }} />
          )}
        </Box>
      );
    });

  const renderParticipants = () => (
    <Box sx={{ display: 'flex', bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#000', 0.012), py: 1.5 }}>
      <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
      {services.map((s, i) => (
        <Box key={s} sx={{ width: COL_W, minWidth: COL_W, display: 'flex', justifyContent: 'center' }}>
          <Participant name={s} color={getColor(i)} type={serviceTypes[s]} status={serviceStatuses[s]} isDark={isDark} />
        </Box>
      ))}
    </Box>
  );

  const renderConnector = (height = 10, borderTop = false) => (
    <Box sx={{ display: 'flex', height, ...(borderTop && { borderTop: `1px solid ${isDark ? alpha('#fff', 0.05) : alpha('#000', 0.05)}` }) }}>
      <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
      {services.map((s, i) => {
        const c = getColor(i);
        const isErr = serviceStatuses[s] === 'error';
        return (
          <Box key={i} sx={{ width: COL_W, minWidth: COL_W, position: 'relative' }}>
            <Box sx={{
              position: 'absolute', top: 0, bottom: 0, left: '50%', width: 0,
              borderLeft: `1.5px dashed ${alpha(isErr ? '#ef4444' : c, isDark ? 0.2 : 0.15)}`,
              transform: 'translateX(-0.75px)',
            }} />
          </Box>
        );
      })}
    </Box>
  );

  const formatDuration = (ms: number) => ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  const formatDurationPrecise = (ms: number) => ms > 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
          Request Flow
        </Typography>
        <Typography color="text.secondary">
          Sequence diagram for{' '}
          <Typography component="span" fontFamily="monospace" fontWeight={600} fontSize="inherit">
            {requestId}
          </Typography>
        </Typography>
      </Box>

      {errorNode && <ErrorBanner node={errorNode} isDark={isDark} />}

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        <StatCard label="Services" value={services.length} />
        <StatCard label="Log Entries" value={requestLogs.length} />
        <StatCard label="Duration" value={formatDuration(totalDuration)} />
        <StatCard label="Errors" value={errorCount} valueColor={errorCount > 0 ? 'error' : undefined} />
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 24, height: 0, borderTop: '2px solid #3b82f6' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Request</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 24, height: 0, borderTop: '2px dashed #94a3b8' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Response</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 24, height: 0, borderTop: '2px dashed #ef4444' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Error</Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          size="small"
          onClick={Object.keys(expanded).length > 0 ? collapseAll : expandAll}
          sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
        >
          {Object.keys(expanded).length > 0 ? 'Collapse All' : 'Expand All'}
        </Button>
      </Box>

      {/* Diagram */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: totalW }}>
            {renderParticipants()}
            {renderConnector(10)}

            {seqEvents.map((ev) => {
              const isExp = expanded[ev.id] ?? false;
              const activeCol = ev.isResponse ? ev.fromCol : ev.toCol;
              const matchLog = ev.isResponse
                ? requestLogs.find((l) => services[ev.fromCol] === l.service)
                : requestLogs.find((l) => services[ev.toCol] === l.service);

              return (
                <React.Fragment key={ev.id}>
                  <Box sx={{
                    display: 'flex', height: ROW_H, position: 'relative',
                    borderTop: `1px solid ${isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04)}`,
                    transition: 'background-color 0.15s',
                    '&:hover': { bgcolor: isDark ? alpha('#fff', 0.015) : alpha('#000', 0.012) },
                    ...(ev.status === 'error' && {
                      bgcolor: isDark ? alpha('#ef4444', 0.04) : alpha('#ef4444', 0.02),
                      '&:hover': { bgcolor: isDark ? alpha('#ef4444', 0.06) : alpha('#ef4444', 0.035) },
                    }),
                  }}>
                    <Box sx={{
                      width: TS_W, minWidth: TS_W, flexShrink: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      borderRight: `1px solid ${isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04)}`,
                      gap: 0.25,
                    }}>
                      {ev.isResponse
                        ? <ArrowBack sx={{ fontSize: 11, color: ev.status === 'error' ? '#ef4444' : 'text.disabled' }} />
                        : <ArrowForward sx={{ fontSize: 11, color: '#3b82f6' }} />}
                      {ev.duration != null && (
                        <Typography variant="caption" fontFamily="monospace" sx={{
                          fontSize: '0.58rem',
                          color: ev.status === 'error' ? '#ef4444' : 'text.secondary',
                          fontWeight: 600,
                        }}>
                          {ev.duration}ms
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', position: 'relative', flex: 1 }}>
                      {renderLifelines(activeCol)}
                      <SvgArrow fromCol={ev.fromCol} toCol={ev.toCol}
                        totalCols={services.length} isResponse={ev.isResponse} status={ev.status} />
                      <MsgLabel fromCol={ev.fromCol} toCol={ev.toCol}
                        label={ev.label} isResponse={ev.isResponse} status={ev.status}
                        duration={ev.duration} isExpanded={isExp} onToggle={() => toggle(ev.id)}
                        isDark={isDark} isErrorSource={ev.isErrorSource} />
                    </Box>
                  </Box>

                  <Collapse in={isExp}>
                    {matchLog && (
                      <DetailPanel log={matchLog} color={ev.status === 'error' ? '#ef4444' : getColor(activeCol)} isDark={isDark} onViewLog={onViewLog} />
                    )}
                  </Collapse>
                </React.Fragment>
              );
            })}

            {renderConnector(10, true)}
            {renderParticipants()}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{
          p: 2.5, borderTop: 2, borderColor: 'divider',
          display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center',
          bgcolor: isDark ? alpha('#fff', 0.01) : alpha('#000', 0.01),
        }}>
          <FooterStat label="Total Duration" value={formatDurationPrecise(totalDuration)} mono />
          <FooterStat label="Services" value={String(services.length)} />
          <FooterStat label="Steps" value={String(requestLogs.reduce((s, l) => s + l.steps.length, 0))} />
          {errorCount > 0 && <FooterStat label="Errors" value={String(errorCount)} color="#ef4444" />}
          {warnCount > 0 && <FooterStat label="Warnings" value={String(warnCount)} color="#f59e0b" />}
        </Box>
      </Card>
    </Box>
  );
}
