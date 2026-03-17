/**
 * Типизированные ключи палитры темы для автодополнения в sx, bgcolor, color и т.д.
 *
 * Использование:
 *   bgcolor: palette.background.paper
 *   color: palette.primary.main
 */
export const palette = {
  background: {
    default: 'background.default',
    paper: 'background.paper',
  },
  primary: {
    main: 'primary.main',
    light: 'primary.light',
    dark: 'primary.dark',
  },
  text: {
    primary: 'text.primary',
    secondary: 'text.secondary',
    disabled: 'text.disabled',
  },
  grey: {
    50: 'grey.50',
    100: 'grey.100',
    200: 'grey.200',
    300: 'grey.300',
    400: 'grey.400',
    500: 'grey.500',
    600: 'grey.600',
    700: 'grey.700',
    800: 'grey.800',
    900: 'grey.900',
  },
  error: {
    main: 'error.main',
    light: 'error.light',
    dark: 'error.dark',
  },
  success: {
    main: 'success.main',
    light: 'success.light',
    dark: 'success.dark',
  },
  warning: {
    main: 'warning.main',
    light: 'warning.light',
    dark: 'warning.dark',
  },
  info: {
    main: 'info.main',
    light: 'info.light',
    dark: 'info.dark',
  },
  divider: 'divider',
} as const;
