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
    }
    termsAccepted: boolean;
  }
  
export interface ValidationErrors {
    [key: string]: { message: string }[];
}
  