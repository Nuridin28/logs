import React from 'react';
import { Link, useParams } from 'react-router';
import { Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';

interface ViewLogButtonProps {
  logId: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function ViewLogButton({ logId, fullWidth, children }: ViewLogButtonProps) {
  const { requestId } = useParams<{ requestId: string }>();

  return (
    <Button
      component={Link}
      to={`/${requestId}/log/${logId}`}
      variant="contained"
      size="small"
      startIcon={<Visibility />}
      fullWidth={fullWidth}
    >
      {children ?? 'View'}
    </Button>
  );
}
