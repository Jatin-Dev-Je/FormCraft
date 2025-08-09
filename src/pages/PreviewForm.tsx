import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { RootState } from '../store';
import { FormInput, FormState, ValidationError } from '../types/form';
import { getFormById } from '../utils/localStorage';
import { validateForm } from '../utils/validation';
import FormRenderer from '../components/FormRenderer';

const PreviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const [formData, setFormData] = useState<FormInput>({});
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadForm = () => {
      setLoading(true);
      
      // If we have an ID, load from localStorage
      if (id) {
        const savedForm = getFormById(id);
        if (savedForm) {
          setForm({
            id: savedForm.id,
            name: savedForm.name,
            fields: savedForm.fields,
            createdAt: savedForm.createdAt,
            updatedAt: new Date().toISOString(),
          });
        } else {
          setError('Form not found');
        }
      } 
      // Otherwise, use current form from Redux
      else if (currentForm) {
        setForm(currentForm);
      } else {
        setError('No form to preview');
      }
      
      setLoading(false);
    };

    loadForm();
  }, [id, currentForm]);

  const handleDataChange = (data: FormInput) => {
    setFormData(data);
    if (form) {
      const validationErrors = validateForm(data, form.fields);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = () => {
    if (form) {
      const validationErrors = validateForm(formData, form.fields);
      setErrors(validationErrors);
      if (validationErrors.length === 0) {
        // Form is valid
        alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
      }
    }
  };

  const handleBackToBuilder = () => {
    navigate('/create');
  };

  const handleBackToForms = () => {
    navigate('/myforms');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading form...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToBuilder}
          >
            Back to Builder
          </Button>
          <Button
            variant="outlined"
            onClick={handleBackToForms}
          >
            My Forms
          </Button>
        </Box>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No form to preview. Create a form first.
        </Alert>
        <Button
          variant="contained"
          onClick={handleBackToBuilder}
        >
          Go to Form Builder
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {form.name || 'Form Preview'}
          </Typography>
          {form.name && (
            <Typography variant="body2" color="textSecondary">
              Form ID: {form.id}
            </Typography>
          )}
        </Box>
        <Box display="flex" gap={2}>
          {id ? (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToForms}
            >
              Back to My Forms
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToBuilder}
            >
              Back to Builder
            </Button>
          )}
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is how your form will appear to end users. Test all fields and validations.
      </Alert>

      <FormRenderer
        fields={form.fields}
        onDataChange={handleDataChange}
        initialData={formData}
        errors={errors}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={errors.length > 0}
        >
          Submit Form
        </Button>
      </Box>

      {/* Form Data and Errors Debug (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Paper sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Form Data (Debug)
            </Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Paper>
          {errors.length > 0 && (
            <Paper sx={{ mt: 2, p: 2, backgroundColor: '#fff3f3' }}>
              <Typography variant="h6" gutterBottom color="error">
                Validation Errors
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(errors, null, 2)}
              </pre>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default PreviewForm;
