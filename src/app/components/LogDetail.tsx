import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowBack,
  Error as ErrorIcon,
  AccessTime,
  Dns,
  Category,
} from '@mui/icons-material';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { mockLogs } from '../utils/mockLogs';
import { formatTimestamp } from '../utils/format';
import { LevelChip, Card, StatCard, EmptyState } from './ui';

export default function LogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const log = mockLogs.find((l) => l.id === id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

  if (!log) {
    return (
      <Box sx={{ maxWidth: 896, mx: 'auto' }}>
        <EmptyState
          icon={ErrorIcon}
          title="Log Not Found"
          description="The requested log entry could not be found."
          action={
            <Button component={Link} to="/" variant="contained" startIcon={<ArrowBack />}>
              Back to Logs
            </Button>
          }
        />
      </Box>
    );
  }

  const metadataItems = [
    { icon: <AccessTime />, label: 'Timestamp', value: formatTimestamp(log.timestamp, { includeYear: true }) },
    { icon: <Category />, label: 'Container', value: log.container, mono: true },
    { icon: <Dns />, label: 'Service', value: log.service },
  ];

  return (
    <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ color: 'text.secondary', mb: { xs: 2, sm: 3 } }}
      >
        Back to Logs
      </Button>

      <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.5, mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <LevelChip level={log.level} size="medium" iconSize={20} />
              <Typography variant="h6" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                {log.message}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Log ID: {log.id}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
            mt: 2,
          }}
        >
          {metadataItems.map((item) => (
            <Box key={item.label} sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: isDark ? 'grey.800' : 'grey.100',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontFamily={item.mono ? 'monospace' : undefined}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Host
          </Typography>
          <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
            {log.host}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
