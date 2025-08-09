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
  Divider,
  Paper,
  Tooltip,
  Badge,
} from '@mui/material';
import { 
  Delete, 
  ExpandMore, 
  Add as AddIcon,
  Settings,
  Rule,
  List,
  Star,
  Info
} from '@mui/icons-material';
import { FormField, ValidationRule, FieldType } from '../types/form';
import { FIELD_TYPE_OPTIONS, VALIDATION_RULE_OPTIONS } from '../constants';
import { needsOptions, createDefaultValidationRule, needsValidationValue } from '../utils/formHelpers';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onDelete }) => {
  const [localField, setLocalField] = useState<FormField>(field);
  const [newOption, setNewOption] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    options: false,
    validation: false
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update local state when field prop changes
  React.useEffect(() => {
    setLocalField(field);
  }, [field]);

  // Debounced update function
  const updateParent = React.useCallback((updatedField: FormField) => {
    onUpdate(updatedField);
  }, [onUpdate]);

  const addValidationRule = (type: ValidationRule['type']) => {
    const newRule = createDefaultValidationRule(type);
    const updatedField = {
      ...localField,
      validationRules: [...localField.validationRules, newRule],
      updatedAt: new Date().toISOString()
    };
    setLocalField(updatedField);
    updateParent(updatedField);
  };

  const updateValidationRule = (index: number, rule: Partial<ValidationRule>) => {
    const updatedRules = [...localField.validationRules];
    updatedRules[index] = { ...updatedRules[index], ...rule };
    const updatedField = {
      ...localField,
      validationRules: updatedRules,
      updatedAt: new Date().toISOString()
    };
    setLocalField(updatedField);
    updateParent(updatedField);
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = localField.validationRules.filter((_: ValidationRule, i: number) => i !== index);
    const updatedField = {
      ...localField,
      validationRules: updatedRules,
      updatedAt: new Date().toISOString()
    };
    setLocalField(updatedField);
    updateParent(updatedField);
  };

  const addOption = () => {
    if (newOption.trim()) {
      const options = localField.options || [];
      const updatedField = {
        ...localField,
        options: [...options, newOption.trim()],
        defaultValue: !localField.defaultValue ? newOption.trim() : localField.defaultValue,
        updatedAt: new Date().toISOString()
      };
      setLocalField(updatedField);
      updateParent(updatedField);
      setNewOption('');
    }
  };

  const fieldNeedsOptions = needsOptions(localField.type);

  return (
    <Card 
      sx={{ 
        mb: 3, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Settings fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {localField.label || 'New Field'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {FIELD_TYPE_OPTIONS.find(opt => opt.value === localField.type)?.label} Field
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Delete Field">
            <IconButton 
              onClick={() => onDelete(localField.id)} 
              color="error"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'error.light', 
                  color: 'white' 
                } 
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Basic Field Configuration */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings color="primary" fontSize="small" />
            Basic Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Field Label"
                value={localField.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const updatedField = {
                    ...localField,
                    label: value,
                    updatedAt: new Date().toISOString()
                  };
                  setLocalField(updatedField);
                  // Update parent immediately so the header updates
                  updateParent(updatedField);
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim() === '' ? 'Untitled Field' : e.target.value;
                  if (value !== localField.label) {
                    const updatedField = {
                      ...localField,
                      label: value,
                      updatedAt: new Date().toISOString()
                    };
                    setLocalField(updatedField);
                    updateParent(updatedField);
                  }
                }}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={localField.type}
                  label="Field Type"
                  onChange={(e: SelectChangeEvent) => {
                    const newType = e.target.value as FieldType;
                    const updatedField = {
                      ...localField,
                      type: newType,
                      defaultValue: '',
                      options: needsOptions(newType) ? [] : undefined,
                      validationRules: [],
                      updatedAt: new Date().toISOString()
                    };
                    setLocalField(updatedField);
                    updateParent(updatedField);
                  }}
                  fullWidth
                  sx={{ 
                    bgcolor: 'white',
                    '& .MuiSelect-select': { 
                      padding: '14px' 
                    }
                  }}
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

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Default Value"
                value={localField.defaultValue || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedField = {
                    ...localField,
                    defaultValue: e.target.value,
                    updatedAt: new Date().toISOString()
                  };
                  setLocalField(updatedField);
                  // Update parent immediately
                  updateParent(updatedField);
                }}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white'
                  }
                }}
                placeholder="Enter default value..."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localField.required}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedField = {
                          ...localField,
                          required: e.target.checked,
                          updatedAt: new Date().toISOString()
                        };
                        setLocalField(updatedField);
                        updateParent(updatedField);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star fontSize="small" color={localField.required ? "error" : "disabled"} />
                      <Typography variant="body2" fontWeight={localField.required ? 600 : 400}>
                        Required
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Options for select, radio, checkbox */}
        {fieldNeedsOptions && (
          <Accordion 
            expanded={expandedSections.options}
            onChange={(_, expanded) => setExpandedSections(prev => ({ ...prev, options: expanded }))}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '&:before': { display: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMore />}
              sx={{ 
                bgcolor: 'primary.50',
                '&:hover': { bgcolor: 'primary.100' },
                borderRadius: expandedSections.options ? '8px 8px 0 0' : '8px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <List color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Options
                </Typography>
                <Badge 
                  badgeContent={localField.options?.length || 0} 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
                    <TextField
                      label="New Option"
                      value={newOption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOption(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && addOption()}
                      size="small"
                      fullWidth={isMobile}
                      sx={{ flexGrow: 1 }}
                      placeholder="Enter option text..."
                    />
                    <Button 
                      onClick={addOption} 
                      variant="contained" 
                      size="small"
                      startIcon={<AddIcon />}
                      fullWidth={isMobile}
                      sx={{ 
                        minWidth: 100,
                        height: 40
                      }}
                      disabled={!newOption.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {(localField.options?.length ?? 0) > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {localField.options?.map((option: string, index: number) => (
                        <Chip
                          key={option + index}
                          label={option}
                          onDelete={() => {
                            const updatedOptions = localField.options?.filter((_, i) => i !== index) || [];
                            const updatedField = {
                              ...localField,
                              options: updatedOptions,
                              defaultValue: updatedOptions.length > 0 ? updatedOptions[0] : '',
                              updatedAt: new Date().toISOString()
                            };
                            setLocalField(updatedField);
                            updateParent(updatedField);
                          }}
                          sx={{ 
                            bgcolor: 'primary.50',
                            color: 'primary.700',
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.700',
                              '&:hover': { color: 'error.main' }
                            }
                          }}
                          size="medium"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 4, 
                        color: 'text.secondary',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2
                      }}
                    >
                      <List sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">
                        No options added yet. Add your first option above.
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Validation Rules */}
        <Accordion
          expanded={expandedSections.validation}
          onChange={(_, expanded) => setExpandedSections(prev => ({ ...prev, validation: expanded }))}
          sx={{ 
            borderRadius: 2,
            '&:before': { display: 'none' },
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              bgcolor: 'warning.50',
              '&:hover': { bgcolor: 'warning.100' },
              borderRadius: expandedSections.validation ? '8px 8px 0 0' : '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rule color="warning" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation Rules
              </Typography>
              <Badge 
                badgeContent={localField.validationRules.length} 
                color="warning"
                sx={{ ml: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Add Validation Rule Buttons */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Available Validations:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {VALIDATION_RULE_OPTIONS.map((ruleOption) => (
                    <Button
                      key={ruleOption.value}
                      size="small"
                      variant="outlined"
                      onClick={() => addValidationRule(ruleOption.value as ValidationRule['type'])}
                      disabled={localField.validationRules.some((rule: ValidationRule) => rule.type === ruleOption.value)}
                      sx={{ 
                        mb: 1,
                        borderColor: 'warning.main',
                        color: 'warning.main',
                        '&:hover': {
                          borderColor: 'warning.dark',
                          bgcolor: 'warning.50'
                        },
                        '&:disabled': {
                          borderColor: 'grey.300',
                          color: 'grey.400'
                        }
                      }}
                    >
                      {ruleOption.label}
                    </Button>
                  ))}
                </Box>
              </Grid>

              {/* Existing Validation Rules */}
              <Grid item xs={12}>
                {localField.validationRules.length > 0 ? (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Active Rules:
                    </Typography>
                    {localField.validationRules.map((rule: ValidationRule, index: number) => (
                      <Paper 
                        key={index} 
                        elevation={1} 
                        sx={{ 
                          mb: 2, 
                          p: 2, 
                          border: '1px solid',
                          borderColor: 'warning.200',
                          borderRadius: 2,
                          bgcolor: 'warning.25'
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm="auto">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rule color="warning" fontSize="small" />
                              <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 100 }}>
                                {rule.type}
                              </Typography>
                            </Box>
                          </Grid>
                          {needsValidationValue(rule.type) && (
                            <Grid item xs={12} sm={2}>
                              <TextField
                                type="number"
                                label="Value"
                                value={rule.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = parseInt(e.target.value) || 0;
                                  updateValidationRule(index, { value });
                                }}
                                size="small"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    bgcolor: 'white'
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          <Grid item xs={12} sm={true}>
                            <TextField
                              label="Error Message"
                              value={rule.message}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                updateValidationRule(index, { message: e.target.value })
                              }
                              size="small"
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'white'
                                }
                              }}
                              placeholder="Enter custom error message..."
                            />
                          </Grid>
                          <Grid item xs="auto">
                            <Tooltip title="Remove Rule">
                              <IconButton 
                                onClick={() => removeValidationRule(index)} 
                                size="small"
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    bgcolor: 'error.50'
                                  }
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      color: 'text.secondary',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Rule sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">
                      No validation rules added yet. Click a validation type above to add one.
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FieldEditor;
