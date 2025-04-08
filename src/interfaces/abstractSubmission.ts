import type { ErrorObject } from 'ajv'
export interface FormData {
  callForPapers: string
  title: string
  abstract: string
  contact: Contact[]
  datasets: Dataset[]
  authors: Author[]
  dateCreated: string
  dateLastModified: string
  preferredLanguage: LanguagePreference
  termsAccepted: boolean
}

export enum LanguagePreference {
  MAKE_A_CHOICE= 'Make a choice',
  PYTHON = 'Python',
  R = 'R',
  DEFAULT = 'Default',
}
export interface Contact {
  firstname: string
  lastname: string
  affiliation: string
  email: string
}
export interface Dataset {
  link: string
  description: string
}
export interface Author {
  firstname: string
  lastname: string
  affiliation: string
  email: string
  orcidUrl: string,
  githubId: string
  blueskyId?: string
  facebookId?: string
  primaryContact: boolean
}
export interface ValidationErrors {
  [key: string]: ErrorObject[]
}

export interface FormFieldProps {
  id: string
  label: string | React.ReactNode
  required: boolean
  value: string | boolean
  type?: 'text' | 'email' | 'textarea' | 'checkbox' | 'select'
  options?: { value: string; label: string }[]
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  error?: string
  reset?: boolean
  placeholder?: string
}

export interface FieldConfig {
  label: string
  fieldName: string
  type?: string
  placeholder?: string
  required?: boolean
}

export interface DynamicFormProps {
  id: string
  items: (Dataset | Author | Contact)[]
  onChange: (index: number, fieldName: string, value: string| boolean) => void
  onAdd: () => void
  onRemove: (index: number) => void
  moveItem?: (fromIndex: number, toIndex: number) => void
  confirmEmailError?: string
  errors: ErrorObject[] 
  fieldConfig: FieldConfig[]
  title: string
  explanation: string  | React.ReactNode
  buttonLabel: string
  maxItems?: number
}
export interface SubmissionStatusCardProps {
  data: FormData
  // onReset: (event: React.MouseEvent<HTMLButtonElement>) => void
  errors: ErrorObject[]
  githubError: string
  mailError: string

}

export interface SubmissionSummaryProps {
  formData: Record<string, any>
  handleDownloadJson: () => void
  onReset: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface AbstractSubmissionFormProps {
  callForPapers: string
  makesHeaderDisappear: (isSubmitted: boolean) => void
}
