import React from 'react';
import { Typography } from '@mui/material';

interface ValidationMessageProps {
  error?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
      {error}
    </Typography>
  );
};

export default ValidationMessage;
