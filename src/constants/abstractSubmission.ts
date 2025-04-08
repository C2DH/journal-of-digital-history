import { LanguagePreference } from '../interfaces/abstractSubmission'

export const initialAbstract = (callForPapers: string) => {
  return {
    callForPapers: callForPapers,
    title: '',
    abstract: '',
    datasets: [],
    contact: {
      firstName: '',
      lastName: '',
      affiliation: '',
      email: '',
      orcidUrl: '',
      githubId: '',
      blueskyId: '',
      facebookId: '',
      preferredLanguage: LanguagePreference.PYTHON,
    },
    contributors: [],
    dateCreated: new Date().toISOString(),
    dateLastModified: new Date(Date.now()).toISOString(),
    termsAccepted: false,
  }
}

export const datasetFields = [
  { label: 'Link', fieldName: 'link' },
  { label: 'Description and licence, where applicable', fieldName: 'description', type: 'textarea' },
]

export const datasetEmpty = {
  link: '',
  description: '',
}

export const contributorFields = [
  { label: 'First Name', fieldName: 'firstName' },
  { label: 'Last Name', fieldName: 'lastName' },
  { label: 'Affiliation', fieldName: 'affiliation' },
  { label: 'Email', fieldName: 'email' },
  { label: 'ORCID URL', fieldName: 'orcidUrl' },
]

export const contributorEmpty = {
  firstName: '',
  lastName: '',
  affiliation: '',
  email: '',
  orcidUrl: '',
}

export const preferredLanguageOptions = [
  { value: 'Python', label: 'Python' },
  { value: 'R', label: 'R' },
  { value: 'Default', label: 'No Preferences' },
]

export const dateFormat = {
  weekday: 'long', 
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const;

export const mandatoryTopFields = ['title', 'abstract', 'contact', 'contributors', 'github', 'termsAccepted']