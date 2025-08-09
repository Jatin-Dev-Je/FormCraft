import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Typography,
  Paper,
} from '@mui/material';
import { FormField, FormInput, ValidationError, FieldType } from '../types/form';
import { updateDerivedFields } from '../utils/derived';
import ValidationMessage from './ValidationMessage';

interface FormRendererProps {
  fields: FormField[];
  onDataChange: (data: FormInput) => void;
  initialData?: FormInput;
  errors?: ValidationError[];
}

const FormRenderer: React.FC<FormRendererProps> = ({ 
  fields, 
  onDataChange, 
  initialData = {},
  errors = [] 
}) => {
  const [formData, setFormData] = useState<FormInput>(initialData);

  useEffect(() => {
    // Initialize form data with default values
    const initData: FormInput = { ...initialData };
    
    fields.forEach(field => {
      if (!(field.id in initData) || initData[field.id] === null) {
        switch (field.type) {
          case FieldType.CHECKBOX:
            initData[field.id] = field.defaultValue || [];
            break;
          case FieldType.NUMBER:
            initData[field.id] = field.defaultValue || 0;
            break;
          case FieldType.RADIO:
            initData[field.id] = field.defaultValue || (field.options && field.options[0]) || '';
            break;
          case FieldType.SELECT:
            initData[field.id] = field.defaultValue || (field.options && field.options[0]) || '';
            break;
          default:
            initData[field.id] = field.defaultValue || '';
        }
      }
    });

    // Update derived fields
    const updatedData = updateDerivedFields(initData, fields);
    setFormData(updatedData);
    onDataChange(updatedData);
  }, [fields, initialData]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedData = { ...formData, [fieldId]: value };
    
    // Update derived fields based on the new data
    const finalData = updateDerivedFields(updatedData, fields);
    
    setFormData(finalData);
    onDataChange(finalData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const fieldError = errors.find(e => e.fieldId === field.id);

    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.EMAIL:
        return (
          <TextField
            key={field.id}
            label={field.label}
            type={field.type === FieldType.EMAIL ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={field.isDerived}
            error={!!fieldError}
            helperText={fieldError?.message}
            fullWidth
            margin="normal"
          />
        );

      case FieldType.NUMBER:
        return (
          <TextField
            key={field.id}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={field.isDerived}
            error={!!fieldError}
            helperText={fieldError?.message}
            fullWidth
            margin="normal"
          />
        );

      case FieldType.TEXTAREA:
        return (
          <TextField
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={field.isDerived}
            error={!!fieldError}
            helperText={fieldError?.message}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        );

      case FieldType.DATE:
        return (
          <TextField
            key={field.id}
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={field.isDerived}
            error={!!fieldError}
            helperText={fieldError?.message}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        );

      case FieldType.SELECT:
        return (
          <FormControl key={field.id} fullWidth margin="normal" error={!!fieldError}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              disabled={field.isDerived}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <ValidationMessage error={fieldError?.message} />
          </FormControl>
        );

      case FieldType.RADIO:
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" error={!!fieldError}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio disabled={field.isDerived} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            <ValidationMessage error={fieldError?.message} />
          </FormControl>
        );

      case FieldType.CHECKBOX:
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" error={!!fieldError}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={checkboxValues.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFieldChange(field.id, [...checkboxValues, option]);
                        } else {
                          handleFieldChange(field.id, checkboxValues.filter((v: string) => v !== option));
                        }
                      }}
                      disabled={field.isDerived}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            <ValidationMessage error={fieldError?.message} />
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No form to preview
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create a form with fields first to see the preview
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Form Preview
      </Typography>
      <Paper sx={{ p: 3 }}>
        {fields.map(renderField)}
        
        {errors.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Please fix the following errors:
            </Typography>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2" color="error">
                • {error.message}
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FormRenderer;
