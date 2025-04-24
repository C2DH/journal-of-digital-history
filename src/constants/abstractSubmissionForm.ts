import { LanguagePreference } from '../interfaces/abstractSubmission'

export const initialAbstract = (callForPapers: string) => {
  return {
    callForPapers: callForPapers,
    title: '',
    abstract: '',
    datasets: [],
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
    label: 'author.confirmEmail',
    fieldname: 'confirmEmail',
    placeholder: 'confirmEmail',
    required: true,
  },
  {
    label: 'author.orcidUrl',
    fieldname: 'orcidUrl',
    placeholder: 'orcidUrl',
    required: true,
    helptext: 'author.orcid.helptext',
    tootltip: 'orcidUrl',
  },
  {
    label: 'author.githubId',
    fieldname: 'githubId',
    placeholder: 'githubId',
    required: false,
    helptext: 'author.github.helptext',
    tooltip: 'githubId',
  },
  {
    label: 'author.blueskyId',
    fieldname: 'blueskyId',
    placeholder: 'blueskyId',
    required: false,
    tooltip: 'blueskyId',
  },
  {
    label: 'author.facebookId',
    fieldname: 'facebookId',
    placeholder: 'facebookId',
    required: false,
    tooltip: 'facebookId',
  },
  {
    label: 'author.primaryContact',
    fieldname: 'primaryContact',
    type: 'checkbox',
    required: false,
    tooltip: 'author.primaryContact.tooltip',
  },
]

export const authorEmpty = {
  firstname: '',
  lastname: '',
  affiliation: '',
  email: '',
  confirmEmail: '',
  orcidUrl: '',
  githubId: '',
  blueskyId: '',
  facebookId: '',
  primaryContact: false,
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
  'languagePreference',
  'termsAccepted',
]
