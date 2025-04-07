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
  label: string
  value: string | boolean
  type?: 'text' | 'email' | 'textarea' | 'checkbox' | 'select'
  options?: { value: string; label: string }[]
  onChange: (event:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  error?: string
  reset?: boolean
}
