import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Alert,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  createNewForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  updateFormName,
} from '../store/formSlice';
import { FormField } from '../types/form';
import { saveFormToStorage } from '../utils/localStorage';
import { createDefaultField } from '../utils/formHelpers';
import { useDialog } from '../hooks';
import { ROUTES } from '../constants';
import FieldEditor from '../components/FieldEditor';
import FieldList from '../components/FieldList';
import DerivedFieldEditor from '../components/DerivedFieldEditor';
import PageHeader from '../components/PageHeader';
import NavigationButtons from '../components/NavigationButtons';

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const saveDialog = useDialog();
  const derivedFieldDialog = useDialog();
  const [formName, setFormName] = useState('');
  const [saveError, setSaveError] = useState('');

  React.useEffect(() => {
    // Create new form on component mount
    dispatch(createNewForm());
    setEditingField(null);
  }, [dispatch]);

  const handleAddField = () => {
    const newField = createDefaultField();
    dispatch(addField(newField));
    setEditingField(newField);
  };

  const handleUpdateField = (field: FormField) => {
    dispatch(updateField({ id: field.id, field }));
    // Keep the field selected for continued editing
    setEditingField(field);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
    if (editingField?.id === fieldId) {
      setEditingField(null);
    }
  };

  const handleReorderFields = (fromIndex: number, toIndex: number) => {
    dispatch(reorderFields({ fromIndex, toIndex }));
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
  };

  const handleSaveForm = () => {
    if (!currentForm) return;
    
    if (!formName.trim()) {
      setSaveError('Form name is required');
      return;
    }

    if (currentForm.fields.length === 0) {
      setSaveError('Add at least one field to the form');
      return;
    }

    try {
      const formToSave = {
        ...currentForm,
        name: formName.trim(),
      };
      
      saveFormToStorage(formToSave);
      dispatch(updateFormName(formName.trim()));
      saveDialog.closeDialog();
      setFormName('');
      setSaveError('');
      
      // Navigate to My Forms page
      navigate(ROUTES.MY_FORMS);
    } catch (error) {
      setSaveError('Failed to save form. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!currentForm || currentForm.fields.length === 0) {
      alert('Please add at least one field to preview the form.');
      return;
    }
    navigate(ROUTES.PREVIEW);
  };

  const handleAddDerivedField = (field: FormField) => {
    dispatch(addField(field));
  };

  if (!currentForm) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <PageHeader title="Form Builder">
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NavigationButtons
            variant="create"
            onPreview={handlePreview}
            onSave={() => saveDialog.openDialog()}
            canPreview={currentForm.fields.length > 0}
            canSave={currentForm.fields.length > 0}
          />
        </Box>
      </PageHeader>

      {/* Mobile Action Buttons */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handlePreview}
              disabled={currentForm.fields.length === 0}
              fullWidth
            >
              Preview
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => saveDialog.openDialog()}
              disabled={currentForm.fields.length === 0}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Field List - Full width on mobile, half on desktop */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" gutterBottom>
              Form Structure ({currentForm.fields.length} fields)
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddField}
                  fullWidth={isMobile}
                  sx={{ height: { xs: 48, sm: 40 } }}
                >
                  Add Field
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  onClick={derivedFieldDialog.openDialog}
                  fullWidth={isMobile}
                  sx={{ height: { xs: 48, sm: 40 } }}
                >
                  Add Derived Field
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <FieldList
            fields={currentForm.fields}
            onReorder={handleReorderFields}
            onDelete={handleDeleteField}
            onEdit={handleEditField}
          />
        </Grid>

        {/* Field Editor - Full width on mobile, half on desktop */}
        <Grid item xs={12} lg={6}>
          {editingField ? (
            <Box sx={{ mt: { xs: 3, lg: 0 } }}>
              <Typography variant="h5" gutterBottom>
                Edit Field
              </Typography>
              <Box sx={{ maxHeight: { xs: '70vh', lg: 'none' }, overflowY: 'auto' }}>
                <FieldEditor
                  field={editingField}
                  onUpdate={handleUpdateField}
                  onDelete={handleDeleteField}
                />
              </Box>
            </Box>
          ) : (
            <Paper 
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                textAlign: 'center', 
                height: 'fit-content',
                display: { xs: 'none', lg: 'block' } // Hide on mobile when no field selected
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Field Editor
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Select a field from the list or add a new field to start editing
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Save Form Dialog - Full screen on mobile */}
      <Dialog 
        open={saveDialog.isOpen} 
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            saveDialog.closeDialog();
          }
        }}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <TextField
              autoFocus
              label="Form Name"
              fullWidth
              value={formName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
              error={!!saveError}
              helperText={saveError}
              sx={{ mb: 2 }}
            />
            {currentForm.fields.length > 0 && (
              <Alert severity="info">
                This form contains {currentForm.fields.length} field(s)
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={saveDialog.closeDialog} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button onClick={handleSaveForm} variant="contained" fullWidth={isMobile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Derived Field Dialog */}
      <DerivedFieldEditor
        open={derivedFieldDialog.isOpen}
        onClose={derivedFieldDialog.closeDialog}
        onSave={handleAddDerivedField}
        existingFields={currentForm.fields}
      />

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add field"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddField}
      >
        <Add />
      </Fab>

      {/* Discard Changes Dialog */}
      <Dialog
        open={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        aria-labelledby="discard-dialog-title"
      >
        <DialogTitle id="discard-dialog-title">
          Discard Unsaved Changes?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1 }}>
            You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>
            Continue Editing
          </Button>
          <Button
            onClick={() => {
              setShowDiscardDialog(false);
              navigate(ROUTES.MY_FORMS);
            }}
            color="error"
            variant="contained"
          >
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateForm;
