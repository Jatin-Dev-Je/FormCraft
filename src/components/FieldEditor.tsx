import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import { Delete, ExpandMore } from '@mui/icons-material';
import { FormField, ValidationRule } from '../types/form';
import { FIELD_TYPE_OPTIONS, VALIDATION_RULE_OPTIONS } from '../constants';
import { needsOptions, createDefaultValidationRule, needsValidationValue } from '../utils/formHelpers';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onDelete }) => {
  const [newOption, setNewOption] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFieldChange = (key: keyof FormField, value: any) => {
    onUpdate({
      ...field,
      [key]: value,
    });
  };

  const addValidationRule = (type: ValidationRule['type']) => {
    const newRule = createDefaultValidationRule(type);
    handleFieldChange('validationRules', [...field.validationRules, newRule]);
  };

  const updateValidationRule = (index: number, rule: Partial<ValidationRule>) => {
    const updatedRules = [...field.validationRules];
    updatedRules[index] = { ...updatedRules[index], ...rule };
    handleFieldChange('validationRules', updatedRules);
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = field.validationRules.filter((_: ValidationRule, i: number) => i !== index);
    handleFieldChange('validationRules', updatedRules);
  };

  const addOption = () => {
    if (newOption.trim()) {
      const options = field.options || [];
      handleFieldChange('options', [...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const options = field.options || [];
    handleFieldChange('options', options.filter((_: string, i: number) => i !== index));
  };

  const fieldNeedsOptions = needsOptions(field.type);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
            <Typography variant="h6">
              {field.label || 'New Field'}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => onDelete(field.id)} color="error">
              <Delete />
            </IconButton>
          </Grid>
        </Grid>

        {/* Basic Field Configuration */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Field Label"
              value={field.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('label', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={field.type}
                onChange={(e: SelectChangeEvent) => handleFieldChange('type', e.target.value)}
                fullWidth
              >
                {FIELD_TYPE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Default Value"
              value={field.defaultValue || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('defaultValue', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
          </Grid>
        </Grid>

        {/* Options for select, radio, checkbox */}
        {fieldNeedsOptions && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Options ({field.options?.length || 0})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, mb: 2 }}>
                    <TextField
                      label="New Option"
                      value={newOption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOption(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && addOption()}
                      size="small"
                      fullWidth={isMobile}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button 
                      onClick={addOption} 
                      variant="outlined" 
                      size="small"
                      fullWidth={isMobile}
                      sx={{ mt: isMobile ? 1 : 0 }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {field.options?.map((option: string, index: number) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => removeOption(index)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Validation Rules */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Validation Rules ({field.validationRules.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Add Validation Rule Buttons */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Add Validation:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {VALIDATION_RULE_OPTIONS.map((ruleOption) => (
                    <Button
                      key={ruleOption.value}
                      size="small"
                      variant="outlined"
                      onClick={() => addValidationRule(ruleOption.value as ValidationRule['type'])}
                      disabled={field.validationRules.some((rule: ValidationRule) => rule.type === ruleOption.value)}
                      sx={{ mb: 1 }}
                    >
                      {ruleOption.label}
                    </Button>
                  ))}
                </Box>
              </Grid>

              {/* Existing Validation Rules */}
              <Grid item xs={12}>
                {field.validationRules.map((rule: ValidationRule, index: number) => (
                  <Card key={index} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
                      <Grid item xs={12} sm="auto">
                        <Typography variant="body2" sx={{ minWidth: 100 }}>
                          {rule.type}
                        </Typography>
                      </Grid>
                      {needsValidationValue(rule.type) && (
                        <Grid item xs={12} sm={2}>
                          <TextField
                            type="number"
                            label="Value"
                            value={rule.value || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              updateValidationRule(index, { value: parseInt(e.target.value) })
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                      )}
                      <Grid item xs={isMobile ? 10 : true} sm={true}>
                        <TextField
                          label="Error Message"
                          value={rule.message}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateValidationRule(index, { message: e.target.value })
                          }
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2} sm="auto">
                        <IconButton onClick={() => removeValidationRule(index)} size="small">
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FieldEditor;
