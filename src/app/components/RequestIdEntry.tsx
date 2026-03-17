import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowForward, DarkMode, LightMode } from '@mui/icons-material';
import { Network } from 'lucide-react';
import { Box, Typography, TextField, Button, IconButton, useTheme } from '@mui/material';
import { useTheme as useAppTheme } from '../ThemeProvider';

export default function RequestIdEntry() {
  const [requestId, setRequestId] = useState('');
  const navigate = useNavigate();
  const { mode, toggleTheme } = useAppTheme();
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (requestId.trim()) {
      navigate(`/${requestId.trim()}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 50,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          '&:hover': { bgcolor: isDark ? 'grey.800' : 'grey.100' },
        }}
        aria-label="Toggle theme"
      >
        {mode === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 448, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                bgcolor: isDark ? 'grey.800' : 'grey.100',
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Box sx={{ color: 'primary.main' }}>
                <Network size={32} />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
              Request Flow Visualization
            </Typography>
            <Typography color="text.secondary">
              Enter a request ID to view the complete flow path
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              p: 3,
              boxShadow: 1,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography component="label" variant="body2" fontWeight={500} sx={{ display: 'block', mb: 1 }}>
                Request ID
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Search
                  sx={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'text.disabled',
                    fontSize: 20,
                    pointerEvents: 'none',
                  }}
                />
              <TextField
                id="requestId"
                fullWidth
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="e.g., req-001, req-003..."
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                  },
                  '& .MuiOutlinedInput-input': {
                    pl: 5,
                  },
                }}
              />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Enter the unique identifier for the request you want to trace
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!requestId.trim()}
              endIcon={<ArrowForward />}
              sx={{ py: 1.5 }}
            >
              View Request Flow
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Try these examples:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {['req-001', 'req-003', 'req-005'].map((id) => (
                <Button
                  key={id}
                  variant="outlined"
                  size="small"
                  onClick={() => setRequestId(id)}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    textTransform: 'none',
                  }}
                >
                  {id}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
