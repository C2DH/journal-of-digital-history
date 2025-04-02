export const abstractFields = {
  title: '',
  abstract: '',
  datasets: [
    {
      link: '',
      description: '',
    },
  ],
  contact: {
    firstName: '',
    lastName: '',
    affiliation: '',
    email: '',
    orcidUrl: '',
    githubId: '',
  },
  contributors: [
    {
      firstName: '',
      lastName: '',
      affiliation: '',
      email: '',
      orcid: '',
    },
  ],
  termsAccepted: false,
}

export const datasetFields = [
  { label: 'Link', fieldName: 'link' },
  { label: 'Description', fieldName: 'description', type: 'textarea' },
];

export const datasetEmpty = {
  link: '',
  description: '',
};

export const contributorFields = [
  { label: 'First Name', fieldName: 'firstName' },
  { label: 'Last Name', fieldName: 'lastName' },
  { label: 'Affiliation', fieldName: 'affiliation' },
  { label: 'Email', fieldName: 'email' },
  { label: 'ORCID', fieldName: 'orcid' },
];

export const contributorEmpty = {
  firstName: '',
  lastName: '',
  affiliation: '',
  email: '',
  orcid: '',
};

