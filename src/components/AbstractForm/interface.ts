import type { ErrorObject } from "ajv";

export interface FormData {
  callForPapers: string;
  title: string;
  abstract: string;
  contact : Contact;
  datasets: Dataset[]; 
  contributors: Contributor[];
  dateCreated: string;
  dateLastModified : string;
  termsAccepted: boolean;  
}

interface Contact {
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  orcidUrl: string;
  githubId: string;
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
  orcidUrl: string;
}

export interface ValidationErrors {
  [key: string]: ErrorObject[];
}
  
export interface FormFieldProps {
  id: string;
  label: string;
  value: string | boolean;
  type?: 'text' | 'email' | 'textarea' | 'checkbox'; 
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string; 
  reset?: boolean;
}
