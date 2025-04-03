export const initialAbstract = {
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
  },
  contributors: [],
  termsAccepted: false,
}

export const datasetFields = [
  { label: 'Link', fieldName: 'link' },
  { label: 'Description', fieldName: 'description', type: 'textarea' },
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
