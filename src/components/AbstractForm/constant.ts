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
    },
    contributors: [],
    dateCreated: new Date().toISOString(),
    dateLastModified : new Date(Date.now()).toISOString(),
    termsAccepted: false,
  }
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
