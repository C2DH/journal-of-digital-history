import { LanguagePreference } from '../interfaces/abstractSubmission'

export const initialAbstract = (callForPapers: string) => {
  return {
    callForPapers: callForPapers,
    title: '',
    abstract: '',
    datasets: [],
    contact: {
      firstname: '',
      lastname: '',
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
  { label: 'dataset.link', fieldName: 'link', placeholder:'link' },
  { label: 'dataset.description', fieldName: 'description', type: 'textarea', placeholder:'description' },
]

export const datasetEmpty = {
  link: '',
  description: '',
}

export const contributorFields = [
  { label: 'contributor.firstname', fieldName: 'firstname', placeholder:'firstname' },
  { label: 'contributor.lastname', fieldName: 'lastname', placeholder:'lastname' },
  { label: 'contributor.affiliation', fieldName: 'affiliation', placeholder:'affiliation' },
  { label: 'contributor.email', fieldName: 'email', placeholder:'email' },
  { label: 'contributor.orcid', fieldName: 'orcidUrl', placeholder:'orcid' },
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
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const;

export const mandatoryTopFields = ['title', 'abstract', 'contact', 'contributors', 'github', 'termsAccepted']