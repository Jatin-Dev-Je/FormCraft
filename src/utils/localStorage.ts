import { SavedForm, FormState } from '../types/form';
import { STORAGE_KEYS } from '../constants';

const FORMS_STORAGE_KEY = STORAGE_KEYS.FORMS;

/**
 * Safely parses JSON from localStorage with error handling
 * @param key - The localStorage key
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed value or default
 */
const safeJSONParse = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to parse JSON from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely saves JSON to localStorage with error handling
 * @param key - The localStorage key
 * @param value - The value to save
 * @throws Error if save fails
 */
const safeJSONSave = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
    throw new Error('Failed to save to localStorage');
  }
};

/**
 * Saves a form to localStorage
 * Only saves the schema/configuration, not user input values
 * @param form - The form state to save
 * @throws Error if save fails
 */
export const saveFormToStorage = (form: FormState): void => {
  try {
    const savedForms = getSavedForms();
    const existingIndex = savedForms.findIndex(f => f.id === form.id);
    
    const formToSave: SavedForm = {
      id: form.id,
      name: form.name,
      createdAt: form.createdAt,
      fields: form.fields, // Only save schema, not user input
    };
    
    if (existingIndex >= 0) {
      savedForms[existingIndex] = formToSave;
    } else {
      savedForms.push(formToSave);
    }
    
    safeJSONSave(FORMS_STORAGE_KEY, savedForms);
  } catch (error) {
    console.error('Failed to save form to localStorage:', error);
    throw new Error('Failed to save form');
  }
};

/**
 * Retrieves all saved forms from localStorage
 * @returns Array of saved forms, empty array if none found
 */
export const getSavedForms = (): SavedForm[] => {
  return safeJSONParse(FORMS_STORAGE_KEY, []);
};

/**
 * Retrieves a specific form by ID
 * @param id - The form ID to find
 * @returns The form if found, null otherwise
 */
export const getFormById = (id: string): SavedForm | null => {
  try {
    const savedForms = getSavedForms();
    return savedForms.find(form => form.id === id) || null;
  } catch (error) {
    console.error('Failed to get form by ID:', error);
    return null;
  }
};

/**
 * Deletes a form from localStorage
 * @param id - The form ID to delete
 * @throws Error if delete fails
 */
export const deleteFormFromStorage = (id: string): void => {
  try {
    const savedForms = getSavedForms();
    const filteredForms = savedForms.filter(form => form.id !== id);
    safeJSONSave(FORMS_STORAGE_KEY, filteredForms);
  } catch (error) {
    console.error('Failed to delete form from localStorage:', error);
    throw new Error('Failed to delete form');
  }
};

/**
 * Clears all forms from localStorage
 * Used for development/testing purposes
 */
export const clearAllForms = (): void => {
  try {
    localStorage.removeItem(FORMS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear forms from localStorage:', error);
  }
};
