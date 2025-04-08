import type { ErrorObject } from 'ajv'

export interface FormData {
  callForPapers: string
  title: string
  abstract: string
  contact: Contact
  datasets: Dataset[]
  contributors: Contributor[]
  dateCreated: string
  dateLastModified: string
  termsAccepted: boolean
}

export enum LanguagePreference {
  PYTHON = 'Python',
  R = 'R',
  DEFAULT = 'Default',
}
export interface Contact {
  firstName: string
  lastName: string
  affiliation: string
  email: string
  orcidUrl: string
  githubId: string
  blueskyId?: string
  facebookId?: string
  preferredLanguage: LanguagePreference
}

export interface Dataset {
  link: string
  description: string
}
export interface Contributor {
  firstName: string
  lastName: string
  affiliation: string
  email: string
  orcidUrl: string
}

export interface ValidationErrors {
  [key: string]: ErrorObject[]
}

export interface FormFieldProps {
  id: string
  label: string | React.ReactNode
  value: string | boolean
  type?: 'text' | 'email' | 'textarea' | 'checkbox' | 'select'
  options?: { value: string; label: string }[]
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  error?: string
  reset?: boolean
}

export interface FieldConfig {
  label: string
  fieldName: string
  type?: string
}

export interface DynamicFormProps {
  id: string
  items: (Dataset | Contributor)[]
  onChange: (index: number, fieldName: string, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  moveItem: (fromIndex: number, toIndex: number) => void
  errors: ErrorObject[]
  fieldConfig: FieldConfig[]
  title: string
  buttonLabel: string
  maxItems?: number
}
export interface SubmissionStatusCardProps {
  data: FormData
  onReset: (event: React.MouseEvent<HTMLButtonElement>) => void
  errors: ErrorObject[]
  githubError: string
  mailError: string
}
