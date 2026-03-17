import { Settings } from '@mui/icons-material';
import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography, Checkbox, useTheme } from '@mui/material';

interface Field {
  key: string;
  label: string;
  enabled: boolean;
}

interface FieldSelectorProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
}

export default function FieldSelector({ fields, onFieldsChange }: FieldSelectorProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const toggleField = (key: string) => {
    const updatedFields = fields.map((field) =>
      field.key === key ? { ...field, enabled: !field.enabled } : field
    );
    onFieldsChange(updatedFields);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Settings />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': { borderColor: 'divider', bgcolor: isDark ? 'grey.800' : 'grey.100' },
        }}
      >
        Select Fields
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 256, mt: 1.5 } } }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography fontWeight={500}>Display Fields</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose which columns to show
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          {fields.map((field) => (
            <MenuItem
              key={field.key}
              onClick={() => toggleField(field.key)}
              sx={{ py: 1 }}
            >
              <Checkbox
                checked={field.enabled}
                size="small"
                sx={{ mr: 1.5, pointerEvents: 'none' }}
              />
              <Typography variant="body2">{field.label}</Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
}
