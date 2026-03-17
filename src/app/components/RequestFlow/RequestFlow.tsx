import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Collapse, useTheme, alpha } from '@mui/material';
import { Error as ErrorIcon, ArrowForward, ArrowBack } from '@mui/icons-material';

import type { NodeType, Status, RequestFlowProps } from './types';
import { COL_W, TS_W, ROW_H } from './constants';
import { getColor, formatDuration, formatDurationPrecise, buildSequence } from './helpers';

import Card from './ui/Card';
import StatCard from './ui/StatCard';
import EmptyState from './ui/EmptyState';
import FooterStat from './ui/FooterStat';
import ErrorBanner from './ErrorBanner';
import DetailPanel from './DetailPanel';
import { Participant, SvgArrow, MsgLabel, Lifeline } from './SequenceDiagram';

export default function RequestFlow({ requestId, logs, onViewLog }: RequestFlowProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // ─── Derived data ────────────────────────────────────────────────────────

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

  const totalDuration = useMemo(() => {
    if (requestLogs.length < 2) return 0;
    return new Date(requestLogs[requestLogs.length - 1].timestamp).getTime()
      - new Date(requestLogs[0].timestamp).getTime();
  }, [requestLogs]);

  const errorCount = requestLogs.filter((l) => l.level === 'error').length;
  const warnCount = requestLogs.filter((l) => l.level === 'warn').length;
  const errorNode = flow.find((n) => n.status === 'error');

  // ─── Expand / collapse ───────────────────────────────────────────────────

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    for (const e of seqEvents) next[e.id] = true;
    setExpanded(next);
  };

  const collapseAll = () => setExpanded({});

  // ─── Empty state ─────────────────────────────────────────────────────────

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

  // ─── Layout helpers ──────────────────────────────────────────────────────

  const totalW = TS_W + services.length * COL_W;

  const renderLifelines = (activeCol?: number) =>
    services.map((s, i) => (
      <Lifeline
        key={i}
        color={getColor(i)}
        isError={serviceStatuses[s] === 'error'}
        isActive={i === activeCol}
        isDark={isDark}
      />
    ));

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
    <Box sx={{
      display: 'flex', height,
      ...(borderTop && { borderTop: `1px solid ${isDark ? alpha('#fff', 0.05) : alpha('#000', 0.05)}` }),
    }}>
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

  // ─── Render ──────────────────────────────────────────────────────────────

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
                      <DetailPanel
                        log={matchLog}
                        color={ev.status === 'error' ? '#ef4444' : getColor(activeCol)}
                        isDark={isDark}
                        onViewLog={onViewLog}
                      />
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
