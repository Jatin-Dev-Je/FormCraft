import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Add, Visibility, Delete, DateRange } from '@mui/icons-material';
import { SavedForm } from '../types/form';
import { getSavedForms, deleteFormFromStorage } from '../utils/localStorage';
import { formatDate, getFieldTypeCounts } from '../utils/formHelpers';
import { createNewForm } from '../store/formSlice';
import { useDialog } from '../hooks';
import { ROUTES } from '../constants';
import PageHeader from '../components/PageHeader';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forms, setForms] = useState<SavedForm[]>([]);
  const deleteDialog = useDialog();
  const [formToDelete, setFormToDelete] = useState<SavedForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    try {
      const savedForms = getSavedForms();
      // Sort by creation date (newest first)
      const sortedForms = savedForms.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setForms(sortedForms);
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Clear any existing form data and create a new one
    dispatch(createNewForm());
    navigate(ROUTES.CREATE);
  };

  const handlePreviewForm = (form: SavedForm) => {
    navigate(`${ROUTES.PREVIEW}/${form.id}`);
  };

  const handleDeleteForm = (form: SavedForm) => {
    setFormToDelete(form);
    deleteDialog.openDialog();
  };

  const confirmDelete = () => {
    if (formToDelete) {
      try {
        deleteFormFromStorage(formToDelete.id);
        setForms(forms.filter(f => f.id !== formToDelete.id));
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
    deleteDialog.closeDialog();
    setFormToDelete(null);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading forms...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader title="My Forms">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
        >
          Create New Form
        </Button>
      </PageHeader>

      {forms.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No forms created yet
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Create your first form to get started with the form builder
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNew}
          >
            Create Your First Form
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {forms.length} form{forms.length !== 1 ? 's' : ''} saved
          </Typography>
          
          <Grid container spacing={3}>
            {forms.map((form) => (
              <Grid item xs={12} md={6} lg={4} key={form.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {form.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={2} color="text.secondary">
                      <DateRange fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Created {formatDate(form.createdAt)}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                    </Typography>

                    {/* Field type chips */}
                    <Box mb={2}>
                      {Object.entries(getFieldTypeCounts(form.fields)).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${count} ${type}`}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1, textTransform: 'capitalize' }}
                        />
                      ))}
                    </Box>

                    {/* Derived fields indicator */}
                    {form.fields.some(f => f.isDerived) && (
                      <Chip
                        label="Has Derived Fields"
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => handlePreviewForm(form)}
                    >
                      Preview
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteForm(form)}
                      color="error"
                      title="Delete form"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.closeDialog}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete "{formToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialog.closeDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyForms;
