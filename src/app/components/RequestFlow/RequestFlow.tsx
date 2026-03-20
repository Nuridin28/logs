import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Chip, Collapse, useTheme, alpha } from '@mui/material';
import {
  Error as ErrorIcon, ArrowForward, ArrowBack,
  Timeline, UnfoldMore, UnfoldLess,
} from '@mui/icons-material';

import type { NodeType, Status, RequestFlowProps } from './types';
import { COL_W, TS_W, ROW_H } from './constants';
import { getColor, buildSequence, buildGraphFromLogs, formatDuration, formatTimestamp } from './helpers';

import Card from './ui/Card';
import EmptyState from './ui/EmptyState';
import ErrorBanner from './ErrorBanner';
import DetailPanel from './DetailPanel';
import { Participant, SvgArrow, MsgLabel, Lifeline } from './SequenceDiagram';

export default function RequestFlow({ requestId, logs, onViewLog }: RequestFlowProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const requestLogs = useMemo(
    () => logs
      .filter((log) => log.requestId === requestId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [logs, requestId],
  );

  const flow = useMemo(() => buildGraphFromLogs(requestLogs), [requestLogs]);
  const { nodes, edges } = flow;

  const services = useMemo(() => {
    const seen = new Set<string>();
    return nodes.reduce<string[]>((acc, n) => {
      if (!seen.has(n.name)) { seen.add(n.name); acc.push(n.name); }
      return acc;
    }, []);
  }, [nodes]);

  const serviceTypes = useMemo(() => {
    const map: Record<string, NodeType> = {};
    for (const n of nodes) map[n.name] = n.type;
    return map;
  }, [nodes]);

  const serviceStatuses = useMemo(() => {
    const map: Record<string, Status> = {};
    for (const n of nodes) map[n.name] = n.status;
    return map;
  }, [nodes]);

  const seqEvents = useMemo(() => buildSequence(edges, services), [edges, services]);

  const errorEdge = edges.find((e) => e.isErrorSource);
  const errorLog = errorEdge?.relatedLogId
    ? requestLogs.find((l) => l.id === errorEdge.relatedLogId)
    : undefined;

  const totalDuration = requestLogs.length >= 2
    ? new Date(requestLogs[requestLogs.length - 1].timestamp).getTime() - new Date(requestLogs[0].timestamp).getTime()
    : 0;

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const hasExpanded = Object.values(expanded).some(Boolean);
  const toggleAll = () => {
    if (hasExpanded) {
      setExpanded({});
    } else {
      const next: Record<string, boolean> = {};
      for (const e of seqEvents) next[e.id] = true;
      setExpanded(next);
    }
  };

  if (requestLogs.length === 0) {
    return (
      <EmptyState
        icon={ErrorIcon}
        title="No logs found"
        description={
          <>No logs for <Typography component="span" fontFamily="monospace" fontWeight={600}>{requestId}</Typography></>
        }
      />
    );
  }

  const totalW = TS_W + services.length * COL_W;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Timeline sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700}>Request Flow</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontFamily="monospace" sx={{ fontSize: '0.75rem' }}>
            {requestId}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label={`${services.length} services`} size="small" variant="outlined" />
          <Chip label={`${edges.length} calls`} size="small" variant="outlined" />
          {totalDuration > 0 && (
            <Chip label={formatDuration(totalDuration)} size="small" variant="outlined"
              color={totalDuration > 3000 ? 'warning' : 'default'} />
          )}
          {requestLogs[0] && (
            <Chip label={formatTimestamp(requestLogs[0].timestamp, { fractionalSeconds: true })} size="small" variant="outlined" />
          )}
        </Box>
      </Box>

      {errorEdge && <ErrorBanner edge={errorEdge} log={errorLog} isDark={isDark} />}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[
            { color: '#3b82f6', dash: false, label: 'Request' },
            { color: '#94a3b8', dash: true, label: 'Response' },
            { color: '#ef4444', dash: true, label: 'Error' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 0, borderTop: `2px ${item.dash ? 'dashed' : 'solid'} ${item.color}` }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Button size="small" onClick={toggleAll}
          startIcon={hasExpanded ? <UnfoldLess /> : <UnfoldMore />}
          sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.7rem' }}>
          {hasExpanded ? 'Collapse' : 'Expand'} All
        </Button>
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: totalW }}>
            <Box sx={{ display: 'flex', bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#000', 0.012), py: 1.5 }}>
              <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
              {services.map((s, i) => (
                <Box key={s} sx={{ width: COL_W, minWidth: COL_W, display: 'flex', justifyContent: 'center' }}>
                  <Participant name={s} color={getColor(i)} type={serviceTypes[s]} status={serviceStatuses[s]} isDark={isDark} />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', height: 8 }}>
              <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
              {services.map((s, i) => (
                <Box key={i} sx={{ width: COL_W, minWidth: COL_W, position: 'relative' }}>
                  <Box sx={{
                    position: 'absolute', top: 0, bottom: 0, left: '50%', width: 0,
                    borderLeft: `1.5px dashed ${alpha(serviceStatuses[s] === 'error' ? '#ef4444' : getColor(i), isDark ? 0.2 : 0.15)}`,
                    transform: 'translateX(-0.75px)',
                  }} />
                </Box>
              ))}
            </Box>

            {seqEvents.map((ev, idx) => {
              const isExp = expanded[ev.id] ?? false;
              const activeCol = ev.isResponse ? ev.fromCol : ev.toCol;
              const activeService = ev.isResponse ? services[ev.fromCol] : services[ev.toCol];
              const matchLog = (ev.relatedLogId
                ? requestLogs.find((l) => l.id === ev.relatedLogId)
                : requestLogs.find((l) => l.service === activeService)
              ) ?? requestLogs[0];

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
                      <Typography variant="caption" fontFamily="monospace" sx={{
                        fontSize: '0.5rem', color: 'text.disabled', fontWeight: 500,
                      }}>
                        #{idx + 1}
                      </Typography>
                      {ev.isResponse
                        ? <ArrowBack sx={{ fontSize: 11, color: ev.status === 'error' ? '#ef4444' : 'text.disabled' }} />
                        : <ArrowForward sx={{ fontSize: 11, color: '#3b82f6' }} />}
                      {ev.duration != null && (
                        <Typography variant="caption" fontFamily="monospace" sx={{
                          fontSize: '0.55rem', fontWeight: 700,
                          color: ev.status === 'error' ? '#ef4444' : ev.duration > 1000 ? '#f59e0b' : 'text.secondary',
                        }}>
                          {formatDuration(ev.duration)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', position: 'relative', flex: 1 }}>
                      {services.map((s, i) => (
                        <Lifeline key={i} color={getColor(i)}
                          isError={serviceStatuses[s] === 'error'}
                          isActive={i === activeCol} isDark={isDark} />
                      ))}
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
                      <DetailPanel log={matchLog}
                        color={ev.status === 'error' ? '#ef4444' : getColor(activeCol)}
                        isDark={isDark} onViewLog={onViewLog} />
                    )}
                  </Collapse>
                </React.Fragment>
              );
            })}

            <Box sx={{
              display: 'flex', height: 8,
              borderTop: `1px solid ${isDark ? alpha('#fff', 0.05) : alpha('#000', 0.05)}`,
            }}>
              <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
              {services.map((s, i) => (
                <Box key={i} sx={{ width: COL_W, minWidth: COL_W, position: 'relative' }}>
                  <Box sx={{
                    position: 'absolute', top: 0, bottom: 0, left: '50%', width: 0,
                    borderLeft: `1.5px dashed ${alpha(serviceStatuses[s] === 'error' ? '#ef4444' : getColor(i), isDark ? 0.2 : 0.15)}`,
                    transform: 'translateX(-0.75px)',
                  }} />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#000', 0.012), py: 1.5 }}>
              <Box sx={{ width: TS_W, minWidth: TS_W, flexShrink: 0 }} />
              {services.map((s, i) => (
                <Box key={s} sx={{ width: COL_W, minWidth: COL_W, display: 'flex', justifyContent: 'center' }}>
                  <Participant name={s} color={getColor(i)} type={serviceTypes[s]} status={serviceStatuses[s]} isDark={isDark} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
