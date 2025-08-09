import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { FormField } from '../types/form';
import { getDerivedFieldOptions } from '../utils/derived';
import { FORMULA_EXAMPLES, FIELD_TYPES } from '../constants';

interface DerivedFieldEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  existingFields: FormField[];
  editingField?: FormField | null;
}

const DerivedFieldEditor: React.FC<DerivedFieldEditorProps> = ({
  open,
  onClose,
  onSave,
  existingFields,
  editingField,
}) => {
  const [field, setField] = useState<Partial<FormField>>(() => ({
    id: editingField?.id || crypto.randomUUID(),
    type: editingField?.type || FIELD_TYPES.TEXT,
    label: editingField?.label || '',
    required: editingField?.required || false,
    validationRules: editingField?.validationRules || [],
    isDerived: true,
    parentFields: editingField?.parentFields || [],
    derivedFormula: editingField?.derivedFormula || '',
  }));

  const availableFields = getDerivedFieldOptions(existingFields);

  const handleSave = () => {
    if (!field.label || !field.parentFields?.length || !field.derivedFormula) {
      return;
    }

    onSave(field as FormField);
    handleClose();
  };

  const handleClose = () => {
    setField({
      id: crypto.randomUUID(),
      type: FIELD_TYPES.TEXT,
      label: '',
      required: false,
      validationRules: [],
      isDerived: true,
      parentFields: [],
      derivedFormula: '',
    });
    onClose();
  };

    
  const toggleParentField = (fieldId: string) => {
    const currentParents = field.parentFields || [];
    const updatedParents = currentParents.includes(fieldId)
      ? currentParents.filter(id => id !== fieldId)
      : [...currentParents, fieldId];
    
    setField({ ...field, parentFields: updatedParents });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingField ? 'Edit Derived Field' : 'Create Derived Field'}
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} pt={1}>
          <Alert severity="info">
            Derived fields automatically calculate their values based on other fields in the form.
          </Alert>

          {/* Basic Field Info */}
          <TextField
            label="Field Label"
            value={field.label || ''}
            onChange={(e) => setField({ ...field, label: e.target.value })}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={field.type || FIELD_TYPES.TEXT}
              onChange={(e) => setField({ ...field, type: e.target.value as FormField['type'] })}
            >
              <MenuItem value={FIELD_TYPES.TEXT}>Text</MenuItem>
              <MenuItem value={FIELD_TYPES.NUMBER}>Number</MenuItem>
            </Select>
          </FormControl>

          {/* Parent Fields Selection */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Parent Fields (Select fields this calculation depends on)
            </Typography>
            {availableFields.length === 0 ? (
              <Alert severity="warning">
                No fields available. Add some regular fields first before creating derived fields.
              </Alert>
            ) : (
              <Box>
                {availableFields.map((availableField) => (
                  <FormControlLabel
                    key={availableField.id}
                    control={
                      <Checkbox
                        checked={field.parentFields?.includes(availableField.id) || false}
                        onChange={() => toggleParentField(availableField.id)}
                      />
                    }
                    label={availableField.label}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Formula Selection */}
          <FormControl fullWidth>
            <InputLabel>Calculation Formula</InputLabel>
            <Select
              value={field.derivedFormula || ''}
              onChange={(e) => setField({ ...field, derivedFormula: e.target.value })}
            >
              {FORMULA_EXAMPLES.map((formula) => (
                <MenuItem key={formula.value} value={formula.value}>
                  {formula.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Custom Formula (Advanced)"
            value={field.derivedFormula || ''}
            onChange={(e) => setField({ ...field, derivedFormula: e.target.value })}
            fullWidth
            multiline
            rows={2}
            placeholder="e.g., 'first_name + last_name' or 'field1 + field2'"
            helperText="You can enter a custom formula or select from the dropdown above"
          />

          {/* Formula Examples */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Formula Examples:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • <strong>age_from_dob</strong>: Calculates age from a date of birth field
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • <strong>full_name</strong>: Combines first_name and last_name fields
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • <strong>total</strong>: Sums all selected numeric parent fields
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • <strong>average</strong>: Averages all selected numeric parent fields
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!field.label || !field.parentFields?.length || !field.derivedFormula}
        >
          {editingField ? 'Update' : 'Create'} Derived Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DerivedFieldEditor;
