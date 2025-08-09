// Form types and interfaces

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  EMAIL = 'email',
}

export enum ValidationType {
  REQUIRED = 'required',
  NOT_EMPTY = 'notEmpty',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  EMAIL = 'email',
  CUSTOM_PASSWORD = 'customPassword',
}

export interface ValidationRule {
  type: ValidationType;
  value?: number | string;
  message: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  validationRules: ValidationRule[];
  options?: string[]; // For select, radio, checkbox fields
  isDerived: boolean;
  parentFields?: string[]; // IDs of parent fields for derived fields
  derivedFormula?: string; // Formula or logic for computation
}

export interface FormState {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormBuilderState {
  currentForm: FormState | null;
  isLoading: boolean;
  error: string | null;
}

export interface SavedForm {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}

export interface FormInput {
  [fieldId: string]: string | number | boolean | string[] | null;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}
