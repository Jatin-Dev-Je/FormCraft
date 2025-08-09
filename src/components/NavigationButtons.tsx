import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ArrowBack, Preview, Save } from '@mui/icons-material';
import { ROUTES } from '../constants';

interface NavigationButtonsProps {
  variant?: 'create' | 'preview' | 'myforms';
  onSave?: () => void;
  onPreview?: () => void;
  canSave?: boolean;
  canPreview?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  variant = 'create',
  onSave,
  onPreview,
  canSave = false,
  canPreview = false,
}) => {
  const navigate = useNavigate();

  const handleBackToBuilder = () => navigate(ROUTES.CREATE);
  const handleBackToForms = () => navigate(ROUTES.MY_FORMS);

  if (variant === 'create') {
    return (
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<Preview />}
          onClick={onPreview}
          disabled={!canPreview}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={onSave}
          disabled={!canSave}
        >
          Save Form
        </Button>
      </Box>
    );
  }

  if (variant === 'preview') {
    return (
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToBuilder}
        >
          Back to Builder
        </Button>
      </Box>
    );
  }

  if (variant === 'myforms') {
    return (
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToForms}
        >
          Back to My Forms
        </Button>
      </Box>
    );
  }

  return null;
};

export default NavigationButtons;
