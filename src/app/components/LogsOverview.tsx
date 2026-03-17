import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { SwapVert, Info as InfoIcon, Visibility } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { mockLogs, logFields as initialFields, Log, LogLevel } from '../utils/mockLogs';
import { formatTimestamp } from '../utils/format';
import FieldSelector from './FieldSelector';
import Pagination from './Pagination';
import ViewLogButton from './ViewLogButton';
import { LevelChip, PageHeader, Card, EmptyState } from './ui';

type SortField = 'timestamp' | 'container' | 'service' | 'level';
type SortDirection = 'asc' | 'desc';

export default function LogsOverview() {
  const { requestId } = useParams<{ requestId: string }>();
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [fields, setFields] = useState(initialFields.map((f) => ({ ...f })));
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const sortedLogs = useMemo(() => {
    let filtered = mockLogs.filter((log) => log.requestId === requestId);
    if (selectedLevel !== 'all') {
      filtered = filtered.filter((log) => log.level === selectedLevel);
    }
    return filtered.sort((a, b) => {
      let aVal: string | number = a[sortField] as string;
      let bVal: string | number = b[sortField] as string;
      if (sortField === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection, selectedLevel, requestId]);

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLogs.slice(start, start + itemsPerPage);
  }, [sortedLogs, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const enabledFields = fields.filter((f) => f.enabled);

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <PageHeader
        title="Logs Overview"
        subtitle="Monitor and analyze system logs in real-time"
      />

      <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
            <Typography variant="body2" fontWeight={500} color="text.secondary">
              Filter by level:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(['all', 'error', 'warn', 'info', 'success', 'debug'] as const).map((level) => (
                <Button
                  key={level}
                  size="small"
                  variant={selectedLevel === level ? 'contained' : 'outlined'}
                  onClick={() => setSelectedLevel(level)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </Box>
          </Box>
          <FieldSelector fields={fields} onFieldsChange={setFields} />
        </Box>
      </Card>

      {!isMobile && (
        <TableContainer
          component={Box}
          sx={{ overflow: 'hidden' }}
        >
          <Card>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? 'grey.800' : 'grey.100' }}>
                  {enabledFields.map((field) => (
                    <TableCell key={field.key}>
                      <Button
                        size="small"
                        onClick={() => handleSort(field.key as SortField)}
                        startIcon={<SwapVert />}
                        sx={{ color: 'text.secondary', textTransform: 'none' }}
                      >
                        {field.label}
                      </Button>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} color="text.secondary">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    {enabledFields.map((field) => (
                      <TableCell key={field.key}>
                        {field.key === 'timestamp' && (
                          <Typography variant="body2" color="text.secondary">
                            {formatTimestamp(log.timestamp)}
                          </Typography>
                        )}
                        {field.key === 'level' && <LevelChip level={log.level} />}
                        {field.key === 'container' && (
                          <Typography variant="body2" fontFamily="monospace">
                            {log.container}
                          </Typography>
                        )}
                        {field.key === 'service' && (
                          <Typography variant="body2">{log.service}</Typography>
                        )}
                        {field.key === 'message' && (
                          <Typography variant="body2">{log.message}</Typography>
                        )}
                        {field.key === 'host' && (
                          <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                            {log.host}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <ViewLogButton logId={log.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TableContainer>
      )}

      {isMobile && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {paginatedLogs.map((log) => (
            <Card key={log.id} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <LevelChip level={log.level} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(log.timestamp)}
                </Typography>
              </Box>
              <Typography fontWeight={500} sx={{ mb: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {log.message}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
                {enabledFields
                  .filter((f) => !['timestamp', 'level', 'message'].includes(f.key))
                  .map((field) => (
                    <Box key={field.key} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {field.label}:
                      </Typography>
                      <Typography variant="caption" fontFamily={field.key === 'container' || field.key === 'host' ? 'monospace' : undefined}>
                        {log[field.key as keyof Log] as string}
                      </Typography>
                    </Box>
                  ))}
              </Box>
              <ViewLogButton logId={log.id} fullWidth>
                View Details
              </ViewLogButton>
            </Card>
          ))}
        </Box>
      )}

      {paginatedLogs.length === 0 && (
        <EmptyState
          icon={InfoIcon}
          title="No logs found"
          description="No logs found matching your filters"
          iconSize={48}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={itemsPerPage}
        totalItems={sortedLogs.length}
      />
    </Box>
  );
}
