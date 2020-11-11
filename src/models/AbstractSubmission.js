export default class AbstractSubmission {
  constructor({ 
    id,
    title = '',
    abstract = '',
    contact,
    authors = [],
    datasets = [],
    dateLastModified,
  } = {}) {
    this.id = id
    this.title = title
    this.abstract = String(abstract)
    this.contact = contact
    this.authors = authors
    this.datasets = datasets
    if (dateLastModified) {
      this.dateLastModified = dateLastModified instanceof Date 
        ? dateLastModified
        : new Date(dateLastModified)
    } else {
      this.dateLastModified = new Date()
    }
    
  }
  getDateLastModified() {
    return this.dateLastModified instanceof Date 
      ? this.dateLastModified
      : new Date(this.dateLastModified)
  }
}
