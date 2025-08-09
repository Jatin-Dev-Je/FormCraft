import { FormField, FieldType, ValidationType } from '../types/form';
import { DEFAULT_VALIDATION_MESSAGES } from '../constants';

/**
 * Creates a new form field with sensible defaults
 * @param type - The type of field to create
 * @returns A new FormField with default values
 */
export const createDefaultField = (type: FieldType = FieldType.TEXT): FormField => ({
  id: crypto.randomUUID(),
  type,
  label: 'New Field',
  required: false,
  defaultValue: type === FieldType.CHECKBOX ? [] : '',
  validationRules: [],
  isDerived: false,
  ...(needsOptions(type) && { options: [] }),
});

/**
 * Creates a default validation rule with appropriate message
 * @param type - The validation type
 * @returns A validation rule object
 */
export const createDefaultValidationRule = (type: ValidationType) => ({
  type,
  message: DEFAULT_VALIDATION_MESSAGES[type],
  ...(needsValidationValue(type) && { value: 1 }),
});

/**
 * Determines if a field type requires options array
 * @param fieldType - The field type to check
 * @returns true if the field needs options
 */
export const needsOptions = (fieldType: FieldType): boolean => {
  return [FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(fieldType);
};

/**
 * Determines if a validation type requires a numeric value
 * @param validationType - The validation type to check
 * @returns true if the validation needs a value
 */
export const needsValidationValue = (validationType: ValidationType): boolean => {
  return [ValidationType.MIN_LENGTH, ValidationType.MAX_LENGTH].includes(validationType);
};

/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return 'Invalid Date';
  }
};

/**
 * Calculates field type counts for form statistics
 * @param fields - Array of form fields
 * @returns Object with field type counts
 */
export const getFieldTypeCounts = (fields: FormField[]): Record<string, number> => {
  return fields.reduce((counts, field) => {
    counts[field.type] = (counts[field.type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
};
