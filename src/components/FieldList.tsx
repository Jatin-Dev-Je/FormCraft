import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Delete, DragIndicator, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FormField } from '../types/form';

interface FieldListProps {
  fields: FormField[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (fieldId: string) => void;
  onEdit: (field: FormField) => void;
}

const FieldList: React.FC<FieldListProps> = ({ fields, onReorder, onDelete, onEdit }) => {
  const moveUp = (index: number) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < fields.length - 1) {
      onReorder(index, index + 1);
    }
  };

  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No fields added yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Add your first field to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Form Fields ({fields.length})
        </Typography>
      </Box>
      <List>
        {fields.map((field, index) => (
          <ListItem
            key={field.id}
            button
            onClick={() => onEdit(field)}
            sx={{
              borderBottom: '1px solid #eee',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Box display="flex" alignItems="center" width="100%">
              {/* Drag handle */}
              <DragIndicator sx={{ color: '#ccc', mr: 1 }} />
              
              {/* Field info */}
              <Box flexGrow={1}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">
                        {field.label || 'Untitled Field'}
                      </Typography>
                      <Chip 
                        label={field.type} 
                        size="small" 
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      {field.required && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                      {field.isDerived && (
                        <Chip 
                          label="Derived" 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {field.defaultValue && (
                        <Typography variant="body2" color="textSecondary">
                          Default: {String(field.defaultValue)}
                        </Typography>
                      )}
                      {field.validationRules.length > 0 && (
                        <Typography variant="body2" color="textSecondary">
                          Validations: {field.validationRules.map(r => r.type).join(', ')}
                        </Typography>
                      )}
                      {field.options && field.options.length > 0 && (
                        <Typography variant="body2" color="textSecondary">
                          Options: {field.options.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </Box>
            </Box>

            <ListItemSecondaryAction>
              <Box display="flex" gap={1}>
                {/* Move up/down buttons */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    moveUp(index);
                  }}
                  disabled={index === 0}
                  size="small"
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    moveDown(index);
                  }}
                  disabled={index === fields.length - 1}
                  size="small"
                >
                  <ArrowDownward />
                </IconButton>
                
                {/* Delete button */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(field.id);
                  }}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FieldList;
