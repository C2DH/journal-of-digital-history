import { LanguagePreference } from '../interfaces/abstractSubmission'

export const initialAbstract = (callForPapers: string) => {
  return {
    callForPapers: callForPapers,
    title: '',
    abstract: '',
    datasets: [],
    contact: [],
    authors: [authorEmpty],
    preferredLanguage: LanguagePreference.MAKE_A_CHOICE,
    dateCreated: new Date().toISOString(),
    dateLastModified: new Date(Date.now()).toISOString(),
    termsAccepted: false,
  }
}

export const datasetFields = [
  { label: 'dataset.link', fieldName: 'link', placeholder: 'link' },
  {
    label: 'dataset.description',
    fieldName: 'description',
    type: 'textarea',
    placeholder: 'description',
  },
]

export const datasetEmpty = {
  link: '',
  description: '',
}

export const authorFields = [
  { label: 'author.firstname', fieldName: 'firstname', placeholder: 'firstname', required: true },
  { label: 'author.lastname', fieldName: 'lastname', placeholder: 'lastname', required: true },
  {
    label: 'author.affiliation',
    fieldName: 'affiliation',
    placeholder: 'affiliation',
    required: true,
  },
  { label: 'author.email', fieldName: 'email', placeholder: 'email', required: true },
  { label: 'author.orcid', fieldName: 'orcidUrl', placeholder: 'orcid', required: true },
  { label: 'author.githubId', fieldName: 'githubId', placeholder: 'githubId', required: true },
  { label: 'author.blueskyId', fieldName: 'blueskyId', placeholder: 'blueskyId', required: false },
  {
    label: 'author.facebookId',
    fieldName: 'facebookId',
    placeholder: 'facebookId',
    required: false,
  },
  {
    label: 'author.primaryContact',
    fieldName: 'primaryContact',
    type: 'checkbox',
    required: false,
  },
]

export const contactFields = [
  { label: 'contact.firstname', fieldName: 'firstname', placeholder: 'firstname', required: true },
  { label: 'contact.lastname', fieldName: 'lastname', placeholder: 'lastname', required: true },
  {
    label: 'contact.affiliation',
    fieldName: 'affiliation',
    placeholder: 'affiliation',
    required: true,
  },
  { label: 'contact.email', fieldName: 'email', placeholder: 'email', required: true },
  { label: 'contact.confirmEmail', fieldName: 'confirmEmail', placeholder: 'email', required: true },
]

export const authorEmpty = {
  firstname: '',
  lastname: '',
  affiliation: '',
  email: '',
  orcidUrl: '',
  githubId: '',
  blueskyId: '',
  facebookId: '',
  primaryContact: false,
}

export const contactEmpty = {
  firstname: '',
  lastname: '',
  affiliation: '',
  email: '',
  confirmEmail: '',
}

export const preferredLanguageOptions = [
  { value: '/', label: 'Please make a choice' },
  { value: 'Python', label: 'Python' },
  { value: 'R', label: 'R' },
  { value: 'Default', label: 'No Preferences' },
]

export const dateFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const

export const mandatoryTopFields = [
  'title',
  'abstract',
  'authors',
  'contact',
  'preferredLanguage',
  'termsAccepted',
]
