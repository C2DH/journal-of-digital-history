export interface FormData {
  title: string;
  abstract: string;
  contact : {
    firstName: string;
    lastName: string;
    affiliation: string;
    email: string;
    orcidUrl: string;
    githubId: string;
  },
  datasets: Dataset[]; 
  termsAccepted: boolean;  
  contributors: Contributor[];
  // callForPapers: string;
  // dateCreated: string;
}
export interface Dataset {
  link: string;
  description: string;
}
export interface Contributor {
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  orcid: string;
}
export interface ValidationErrors {
  [key: string]: { message: string }[];
}
  