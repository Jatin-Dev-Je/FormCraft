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
    return evaluateFormula(field.derivedFormula, parentValues);
  } catch (error) {
    console.error('Error computing derived value:', error);
    return '';
  }
};

const evaluateFormula = (formula: string, parentValues: Record<string, any>): any => {
  // Basic formula evaluation
  
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
      // Evaluate math expression safely
      try {
        // Replace field references with actual values
        let expression = formula;
        Object.entries(parentValues).forEach(([key, value]) => {
          expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value || 0));
        });
        
        // Safety check for valid characters
        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
          return evaluateBasicMath(expression);
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

// Safe math expression evaluator (without eval)
const evaluateBasicMath = (expression: string): number => {
  // Remove spaces
  expression = expression.replace(/\s/g, '');
  
  // Simple recursive descent parser for basic arithmetic
  let index = 0;
  
  const parseNumber = (): number => {
    let num = '';
    while (index < expression.length && /[0-9.]/.test(expression[index])) {
      num += expression[index++];
    }
    return parseFloat(num) || 0;
  };
  
  const parseFactor = (): number => {
    if (expression[index] === '(') {
      index++; // skip '('
      const result = parseExpression();
      index++; // skip ')'
      return result;
    }
    return parseNumber();
  };
  
  const parseTerm = (): number => {
    let result = parseFactor();
    while (index < expression.length && (expression[index] === '*' || expression[index] === '/')) {
      const operator = expression[index++];
      const operand = parseFactor();
      if (operator === '*') {
        result *= operand;
      } else {
        result = operand !== 0 ? result / operand : 0;
      }
    }
    return result;
  };
  
  const parseExpression = (): number => {
    let result = parseTerm();
    while (index < expression.length && (expression[index] === '+' || expression[index] === '-')) {
      const operator = expression[index++];
      const operand = parseTerm();
      if (operator === '+') {
        result += operand;
      } else {
        result -= operand;
      }
    }
    return result;
  };
  
  try {
    return parseExpression();
  } catch (error) {
    console.error('Error parsing math expression:', error);
    return 0;
  }
};
