import { ValidationRule, ValidationError } from '../types/form';

export const validateField = (value: any, rules: ValidationRule[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push({ fieldId: '', message: rule.message });
        }
        break;

      case 'notEmpty':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push({ fieldId: '', message: rule.message });
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && rule.value && value.length < Number(rule.value)) {
          errors.push({ fieldId: '', message: rule.message });
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && rule.value && value.length > Number(rule.value)) {
          errors.push({ fieldId: '', message: rule.message });
        }
        break;

      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({ fieldId: '', message: rule.message });
          }
        }
        break;

      case 'customPassword':
        if (value && typeof value === 'string') {
          // Custom password rule: minimum 8 characters, must contain a number
          const hasMinLength = value.length >= 8;
          const hasNumber = /\d/.test(value);
          
          if (!hasMinLength || !hasNumber) {
            errors.push({ fieldId: '', message: rule.message });
          }
        }
        break;

      default:
        break;
    }
  }

  return errors;
};

export const validateForm = (formData: Record<string, any>, fields: any[]): ValidationError[] => {
  const allErrors: ValidationError[] = [];

  fields.forEach(field => {
    if (field.isDerived) return; // Skip validation for derived fields
    
    const fieldValue = formData[field.id];
    const fieldErrors = validateField(fieldValue, field.validationRules);
    
    // Add fieldId to each error
    fieldErrors.forEach(error => {
      error.fieldId = field.id;
      allErrors.push(error);
    });
  });

  return allErrors;
};

export const getValidationMessage = (errors: ValidationError[], fieldId: string): string => {
  const fieldError = errors.find(error => error.fieldId === fieldId);
  return fieldError ? fieldError.message : '';
};
