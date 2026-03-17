import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router';
import {
  Assessment,
  Dashboard,
  AccountTree,
  Menu as MenuIcon,
  Close,
  DarkMode,
  LightMode,
  ArrowBack,
} from '@mui/icons-material';
import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTheme as useAppTheme } from '../ThemeProvider';

const navItems = [
  { pathKey: 'index', label: 'Logs Overview', icon: Dashboard },
  { pathKey: 'request-flow', label: 'Request Flow', icon: AccountTree },
];

export default function Root() {
  const location = useLocation();
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (pathKey: string) => {
    if (pathKey === 'index') return location.pathname === `/${requestId}`;
    return location.pathname === `/${requestId}/${pathKey}`;
  };

  const getPath = (pathKey: string) =>
    pathKey === 'index' ? `/${requestId}` : `/${requestId}/${pathKey}`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'background-color 0.2s',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flex: 1 }}>
            <Assessment sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
            <Box>
              <Typography variant="h6" component="h1" fontWeight={600}>
                LogView
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography variant="caption" color="text.secondary">
                  Request:
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    opacity: 0.9,
                  }}
                >
                  {requestId}
                </Typography>
              </Box>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={(theme) => ({ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' } })}
              >
                Change Request ID
              </Button>

              {navItems.map((item) => (
                <Button
                  key={item.pathKey}
                  component={Link}
                  to={getPath(item.pathKey)}
                  startIcon={<item.icon />}
                sx={(theme) => ({
                  color: isActive(item.pathKey) ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive(item.pathKey) ? (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100') : 'transparent',
                  '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' },
                })}
                >
                  {item.label}
                </Button>
              ))}

              <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }} aria-label="Toggle theme">
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }} aria-label="Toggle theme">
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
              <IconButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{ color: 'text.secondary' }}
              >
                {mobileMenuOpen ? <Close /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {isMobile && mobileMenuOpen && (
          <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.pathKey}
                component={Link}
                to={getPath(item.pathKey)}
                startIcon={<item.icon />}
                onClick={() => setMobileMenuOpen(false)}
                fullWidth
                sx={(theme) => ({
                  justifyContent: 'flex-start',
                  color: isActive(item.pathKey) ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive(item.pathKey) ? (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100') : 'transparent',
                  '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' },
                })}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </AppBar>

      <Box component="main" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
