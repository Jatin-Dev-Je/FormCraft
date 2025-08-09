import { FormField, FormInput } from '../types/form';

export const computeDerivedValue = (
  field: FormField,
  formData: FormInput,
  allFields: FormField[]
): any => {
  if (!field.isDerived || !field.parentFields || !field.derivedFormula) {
    return '';
  }

  try {
    // Get parent field values
    const parentValues: Record<string, any> = {};
    field.parentFields.forEach(parentId => {
      const parentField = allFields.find(f => f.id === parentId);
      if (parentField) {
        parentValues[parentField.label.toLowerCase().replace(/\s+/g, '_')] = formData[parentId] || '';
      }
    });

    // Basic formula evaluation - can be extended
    return evaluateFormula(field.derivedFormula, parentValues, formData);
  } catch (error) {
    console.error('Error computing derived value:', error);
    return '';
  }
};

const evaluateFormula = (formula: string, parentValues: Record<string, any>, formData: FormInput): any => {
  // Simple formula evaluation - this is a basic implementation
  // In production, you might want to use a more robust expression evaluator
  
  // Example formulas:
  // "age_from_dob" - calculate age from date of birth
  // "full_name" - concatenate first and last name
  // "total" - sum of numeric fields
  
  switch (formula.toLowerCase()) {
    case 'age_from_dob':
      const dob = parentValues.date_of_birth || parentValues.dob;
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      return 0;

    case 'full_name':
      const firstName = parentValues.first_name || '';
      const lastName = parentValues.last_name || '';
      return `${firstName} ${lastName}`.trim();

    case 'total':
    case 'sum':
      return Object.values(parentValues).reduce((sum, value) => {
        const num = parseFloat(value) || 0;
        return sum + num;
      }, 0);

    case 'average':
      const values = Object.values(parentValues).filter(v => !isNaN(parseFloat(v as string)));
      if (values.length === 0) return 0;
      const total = values.reduce((sum, value) => sum + parseFloat(value as string), 0);
      return (total / values.length).toFixed(2);

    default:
      // Try to evaluate as a simple mathematical expression
      try {
        // Replace field references with actual values
        let expression = formula;
        Object.entries(parentValues).forEach(([key, value]) => {
          expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value || 0));
        });
        
        // Basic safety check - only allow numbers, operators, and parentheses
        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
          return eval(expression);
        }
      } catch (error) {
        console.error('Error evaluating formula:', error);
      }
      return '';
  }
};

export const updateDerivedFields = (
  formData: FormInput,
  fields: FormField[]
): FormInput => {
  const updatedData = { ...formData };
  
  // Update all derived fields
  fields.forEach(field => {
    if (field.isDerived) {
      updatedData[field.id] = computeDerivedValue(field, formData, fields);
    }
  });
  
  return updatedData;
};

export const getDerivedFieldOptions = (fields: FormField[]): Array<{ id: string; label: string }> => {
  return fields
    .filter(field => !field.isDerived)
    .map(field => ({ id: field.id, label: field.label }));
};
