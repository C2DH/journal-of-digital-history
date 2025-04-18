import { LanguagePreference } from '../interfaces/abstractSubmission'

export const initialAbstract = (callForPapers: string) => {
  return {
    callForPapers: callForPapers,
    title: '',
    abstract: '',
    datasets: [],
    contact: [contactEmpty],
    authors: [authorEmpty],
    languagePreference: LanguagePreference.MAKE_A_CHOICE,
    dateCreated: new Date().toISOString(),
    dateLastModified: new Date(Date.now()).toISOString(),
    termsAccepted: false,
  }
}

export const datasetFields = [
  { label: 'dataset.link', fieldname: 'link', placeholder: 'link' },
  {
    label: 'dataset.description',
    fieldname: 'description',
    type: 'textarea',
    placeholder: 'description',
  },
]

export const datasetEmpty = {
  link: '',
  description: '',
}

export const authorFields = [
  { label: 'author.firstname', fieldname: 'firstname', placeholder: 'firstname', required: true },
  { label: 'author.lastname', fieldname: 'lastname', placeholder: 'lastname', required: true },
  {
    label: 'author.affiliation',
    fieldname: 'affiliation',
    placeholder: 'affiliation',
    required: true,
  },
  { label: 'author.email', fieldname: 'email', placeholder: 'email', required: true },
  {
    label: 'author.orcidUrl',
    fieldname: 'orcidUrl',
    placeholder: 'orcid',
    required: true,
    helptext: 'author.orcid.helptext',
  },
  {
    label: 'author.githubId',
    fieldname: 'githubId',
    placeholder: 'githubId',
    required: false,
    helptext: 'author.github.helptext',
  },
  { label: 'author.blueskyId', fieldname: 'blueskyId', placeholder: 'blueskyId', required: false },
  {
    label: 'author.facebookId',
    fieldname: 'facebookId',
    placeholder: 'facebookId',
    required: false,
  },
  {
    label: 'author.primaryContact',
    fieldname: 'primaryContact',
    type: 'checkbox',
    required: false,
  },
]

export const contactFields = [
  { label: 'contact.firstname', fieldname: 'firstname', placeholder: 'firstname', required: true },
  { label: 'contact.lastname', fieldname: 'lastname', placeholder: 'lastname', required: true },
  {
    label: 'contact.affiliation',
    fieldname: 'affiliation',
    placeholder: 'affiliation',
    required: true,
  },
  { label: 'contact.email', fieldname: 'email', placeholder: 'email', required: true },
  {
    label: 'contact.confirmEmail',
    fieldname: 'confirmEmail',
    placeholder: 'email',
    required: true,
  },
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

export const languagePreferenceOptions = [
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
  'languagePreference',
  'termsAccepted',
]
