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
  dataset: Dataset[]; 
  termsAccepted: boolean;  
  // contributors: [];
  // callForPapers: string;
  // dateCreated: string;
}
export interface Dataset {
  link: string;
  description: string;
}
export interface DatasetFormProps {
  datasets: Dataset[];
  onChange: (index: number, field: string, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors?: { [key: number]: { link?: string; description?: string } };
}
export interface ValidationErrors {
    [key: string]: { message: string }[];
}
  