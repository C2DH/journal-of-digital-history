import type { ErrorObject } from 'ajv';
import React from 'react';

// Interfaces for Form Data
export interface FormData {
  callForPapers: string;
  title: string;
  abstract: string;
  datasets: Dataset[];
  authors: Author[];
  dateCreated: string;
  dateLastModified: string;
  languagePreference: LanguagePreference;
  termsAccepted: boolean;
}

export enum LanguagePreference {
  MAKE_A_CHOICE = 'Make a choice',
  PYTHON = 'Python',
  R = 'R',
  DEFAULT = 'Default',
}
export interface Dataset {
  link: string;
  description: string;
}
export interface Author {
  firstname: string;
  lastname: string;
  affiliation: string;
  email: string;
  confirmEmail?: string;
  orcidUrl: string;
  githubId: string;
  blueskyId?: string;
  facebookId?: string;
  primaryContact: boolean;
}

//Interface for formData from the back-end
export interface AbstractSubmittedBackEnd {
  id: number;
  pid: string;
  title: string;
  abstract: string;
  callpaper: string | null;
  submitted_date: string;
  validation_date: string | null;
  language_preference: string;
  contact_affiliation: string;
  contact_email: string;
  contact_lastname: string;
  contact_firstname: string;
  status: string;
  consented: boolean;
  authors: Author[];
  datasets: Dataset[];
}
export interface AuthorBackEnd {
  id: number;
  lastname: string;
  firstname: string;
  affiliation: string;
  orcid: string;
  city: string | null;
  country: string;
  github_id: string;
  bluesky_id: string;
  facebook_id: string;
}
export interface DatasetBackEnd {
  id: number;
  url: string;
  description: string;
}



// Validation and Error Interfaces
export interface ValidationErrors {
  [key: string]: ErrorObject[];
}

export type ErrorField = Record<string, boolean>;

// Form Field Interfaces
export interface FormFieldProps {
  id: string;
  label: string | React.ReactNode;
  placeholder?: string;
  required: boolean;
  value: string | boolean;
  type?: StaticFieldType;
  options?: DropdownOptions;
  onChange: InputChangeHandler;
  error?: string;
  reset?: boolean;
  isMissing: boolean;
}

export interface FieldConfig {
  label: string;
  fieldname: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helptext?: string;
  tooltip?: string;
}

export interface DynamicFormItem {
  [key: string]: any
  primaryContact?: boolean
}

// Dynamic Form Interfaces
export interface DynamicFormProps {
  id: string;
  title: string;
  explanation: string | React.ReactNode;
  buttonLabel: string;
  fieldConfig: FieldConfig[];
  items:  DynamicFormItem[];
  maxItems?: number;
  onChange: DynamicFieldUpdateHandler;
  onAdd: ActionHandler;
  onRemove: RemoveItemHandler;
  moveItem?: MoveItemHandler;
  errors: ErrorObject[];
  confirmEmailError?: string;
  confirmGithubError?: string;
  missingFields: ErrorField;
}

// Submission Status Interfaces
export interface SubmissionStatusCardProps {
  errors: ErrorObject[];
  githubError: string;
  mailError: string;
  callForPapersError: string;
  isSubmitAttempted: boolean;
}

// Abstract Submission Interfaces
export interface AbstractSubmittedProps {
  formData: AbstractSubmittedBackEnd;
  handleDownloadJson: ActionHandler;
  navigateBack: NavigateBackHandler;
}

export interface AbstractSubmissionFormProps {
  onErrorAPI: ErrorHandler;
}

// General Types
export type StaticFieldType = 'text' | 'email' | 'textarea' | 'checkbox' | 'select';
export type DropdownOptions = { value: string; label: string }[];
export type InputChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;
export type DynamicFieldUpdateHandler = (
  index: number,
  field: string,
  value: string | boolean
) => void;

// Action Types
export type ActionHandler = () => void;
export type ErrorHandler = (err: any) => void;
export type NavigateBackHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// Type-Specific Handlers
export type UpdateFieldHandler = (
  type: string,
  index: number,
  field: string,
  value: string | boolean
) => void;
export type AddItemHandler = (type: string, defaultItem: Record<string, any>) => void;
export type FieldEmptyHandler = (index: number, field: string) => void;
export type GithubIdValidationHandler = (githubId: string) => void;
export type MoveItemHandler = (fromIndex: number, toIndex: number) => void;
export type MoveItemByTypeHandler = (type: string, fromIndex: number, toIndex: number) => void;
export type RemoveItemHandler = (index: number) => void;
export type RemoveItemByTypeHandler = (type: string, index: number) => void;