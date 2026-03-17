import React from 'react';
import { palette } from '../theme/colors';
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { Box, Button, Select, MenuItem, Typography } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
}

const itemsPerPageOptions = [5, 10, 20, 50];

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 0) return null;

  return (
    <Box
      sx={{
        bgcolor: palette.background.paper,
        borderTop: 1,
        borderColor: palette.divider,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        mt: { xs: 2, sm: 3 },
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: { sm: 'space-between' },
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Items per page:
          </Typography>
          <Select
            size="small"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            sx={{
              minWidth: 64,
              '& .MuiSelect-select': { py: 0.5 },
            }}
          >
            {itemsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Button
            size="small"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            sx={{ minWidth: 36, p: 1 }}
          >
            <FirstPage fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{ minWidth: 36, p: 1 }}
          >
            <ChevronLeft fontSize="small" />
          </Button>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {getPageNumbers().map((page, idx) =>
              typeof page === 'number' ? (
                <Button
                  key={idx}
                  size="small"
                  variant={currentPage === page ? 'contained' : 'outlined'}
                  onClick={() => onPageChange(page)}
                  sx={{ minWidth: 36 }}
                >
                  {page}
                </Button>
              ) : (
                <Typography key={idx} variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
                  {page}
                </Typography>
              )
            )}
          </Box>

          <Box sx={{ display: { xs: 'block', sm: 'none' }, px: 1 }}>
            <Typography variant="body2">
              {currentPage} / {totalPages}
            </Typography>
          </Box>

          <Button
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{ minWidth: 36, p: 1 }}
          >
            <ChevronRight fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            sx={{ minWidth: 36, p: 1 }}
          >
            <LastPage fontSize="small" />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          mt: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} to {endItem} of {totalItems} results
        </Typography>
      </Box>
    </Box>
  );
}
