// Constants for field types, validation rules, and other reusable values
import { FieldType, ValidationType } from '../types/form';

export const FIELD_TYPES = FieldType;
export const VALIDATION_TYPES = ValidationType;

export const ROUTES = {
  HOME: '/',
  CREATE: '/create',
  PREVIEW: '/preview',
  PREVIEW_WITH_ID: '/preview/:id',
  MY_FORMS: '/myforms',
} as const;

export const FIELD_TYPE_OPTIONS = [
  { value: FieldType.TEXT, label: 'Text' },
  { value: FieldType.NUMBER, label: 'Number' },
  { value: FieldType.TEXTAREA, label: 'Textarea' },
  { value: FieldType.SELECT, label: 'Select' },
  { value: FieldType.RADIO, label: 'Radio' },
  { value: FieldType.CHECKBOX, label: 'Checkbox' },
  { value: FieldType.DATE, label: 'Date' },
];

export const VALIDATION_RULE_OPTIONS = [
  { value: ValidationType.REQUIRED, label: 'Required', hasValue: false },
  { value: ValidationType.NOT_EMPTY, label: 'Not Empty', hasValue: false },
  { value: ValidationType.MIN_LENGTH, label: 'Min Length', hasValue: true },
  { value: ValidationType.MAX_LENGTH, label: 'Max Length', hasValue: true },
  { value: ValidationType.EMAIL, label: 'Email Format', hasValue: false },
  { value: ValidationType.CUSTOM_PASSWORD, label: 'Custom Password', hasValue: false },
];

export const FORMULA_EXAMPLES = [
  { value: 'age_from_dob', label: 'Calculate Age from Date of Birth' },
  { value: 'full_name', label: 'Concatenate First and Last Name' },
  { value: 'total', label: 'Sum of Selected Fields' },
  { value: 'average', label: 'Average of Selected Fields' },
];

export const DEFAULT_VALIDATION_MESSAGES: Record<ValidationType, string> = {
  [ValidationType.REQUIRED]: 'This field is required',
  [ValidationType.NOT_EMPTY]: 'This field cannot be empty',
  [ValidationType.MIN_LENGTH]: 'Minimum length not met',
  [ValidationType.MAX_LENGTH]: 'Maximum length exceeded', 
  [ValidationType.EMAIL]: 'Please enter a valid email address',
  [ValidationType.CUSTOM_PASSWORD]: 'Password must be at least 8 characters and contain a number',
};

export const STORAGE_KEYS = {
  FORMS: 'upliance-forms',
} as const;
