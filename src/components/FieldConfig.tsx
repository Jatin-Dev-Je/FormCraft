import React from 'react';
import { Box, TextField, FormControlLabel, Switch } from '@mui/material';
import { FormField } from '../types/form';

interface FieldConfigProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

/**
 * Common configuration component for all field types
 * Handles basic properties: label, required, default value
 */
const FieldConfig: React.FC<FieldConfigProps> = ({ field, onUpdate }) => {
  const handleChange = (key: keyof FormField) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onUpdate({ [key]: value });
  };

  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        label="Field Label"
        value={field.label}
        onChange={handleChange('label')}
        fullWidth
        size="medium"
        required
      />
      
      <TextField
        label="Default Value"
        value={field.defaultValue || ''}
        onChange={handleChange('defaultValue')}
        fullWidth
        size="medium"
        placeholder="Optional default value"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={field.required}
            onChange={handleChange('required')}
            color="primary"
          />
        }
        label="Required"
        sx={{ minWidth: 120 }}
      />
    </Box>
  );
};

export default FieldConfig;
