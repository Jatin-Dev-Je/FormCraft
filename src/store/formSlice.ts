import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormState, FormField, FormBuilderState } from '../types/form';

const initialState: FormBuilderState = {
  currentForm: null,
  isLoading: false,
  error: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    createNewForm: (state) => {
      const newForm: FormState = {
        id: crypto.randomUUID(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.currentForm = newForm;
      state.error = null;
    },
    
    loadForm: (state, action: PayloadAction<FormState>) => {
      state.currentForm = action.payload;
      state.error = null;
    },
    
    updateFormName: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.currentForm.fields[index] = { ...state.currentForm.fields[index], ...action.payload.field };
          state.currentForm.updatedAt = new Date().toISOString();
        }
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [reorderedItem] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, reorderedItem);
        state.currentForm.fields = fields;
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    clearCurrentForm: (state) => {
      state.currentForm = null;
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  createNewForm,
  loadForm,
  updateFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  clearCurrentForm,
  setError,
  setLoading,
} = formSlice.actions;

export default formSlice.reducer;
