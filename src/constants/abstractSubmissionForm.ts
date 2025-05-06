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
  {
    label: 'author.primaryContact',
    fieldname: 'primaryContact',
    type: 'checkbox',
    required: false,
    backend: '',
  },
  {
    label: 'author.firstname',
    fieldname: 'firstname',
    placeholder: 'firstname',
    required: true,
    backend: 'firstname',
  },
  {
    label: 'author.lastname',
    fieldname: 'lastname',
    placeholder: 'lastname',
    required: true,
    backend: 'lastname',
  },
  {
    label: 'author.affiliation',
    fieldname: 'affiliation',
    placeholder: 'affiliation',
    required: true,
    backend: 'affiliation',
  },
  {
    label: 'author.email',
    fieldname: 'email',
    placeholder: 'email',
    required: true,
    backend: 'email',
  },
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
    tooltip: 'orcidUrl',
    backend: 'orcid',
  },
  {
    label: 'author.githubId',
    fieldname: 'githubId',
    placeholder: 'githubId',
    required: false,
    helptext: 'author.github.helptext',
    tooltip: 'githubId',
    backend: 'github_id',
  },
  {
    label: 'author.blueskyId',
    fieldname: 'blueskyId',
    placeholder: 'blueskyId',
    required: false,
    tooltip: 'blueskyId',
    backend: 'bluesky_id',
  },
  {
    label: 'author.facebookId',
    fieldname: 'facebookId',
    placeholder: 'facebookId',
    required: false,
    tooltip: 'facebookId',
    backend: 'facebook_id',
  },
]

export const authorEmpty = {
  primaryContact: false,
  firstname: '',
  lastname: '',
  affiliation: '',
  email: '',
  confirmEmail: '',
  orcidUrl: '',
  githubId: '',
  blueskyId: '',
  facebookId: '',
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
  'callForPapers',
  'title',
  'abstract',
  'authors',
  'languagePreference',
  'termsAccepted',
]
