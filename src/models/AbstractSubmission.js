import Author from './Author'


export default class AbstractSubmission {
  constructor({
    id,
    title = '',
    abstract = '',
    contact = new Author(),
    authors = [],
    datasets = [],
    dateLastModified,
    dateCreated,
    acceptConditions = false
  } = {}) {
    this.id = id
    this.title = String(title)
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
    if (dateCreated) {
      this.dateCreated = dateCreated instanceof Date
        ? dateCreated
        : new Date(dateCreated)
    } else {
      this.dateCreated = new Date()
    }
    if (!Object.keys(contact).length) {
      this.contact = new Author()
    }
    this.acceptConditions = Boolean(acceptConditions)
  }

  getDateLastModified() {
    return this.dateLastModified instanceof Date
      ? this.dateLastModified
      : new Date(this.dateLastModified)
  }

  getDateCreated() {
    return this.dateCreated instanceof Date
      ? this.dateCreated
      : new Date(this.dateCreated)
  }

  isEmpty() {
    return (
      this.title.length +
      this.abstract.length +
      this.contact.firstname.length +
      this.contact.lastname.length +
      this.contact.email.length +
      this.contact.affiliation.length +
      this.contact.orcid.length +
      this.authors.length +
      this.datasets.length
    ) === 0
  }

  static isPayloadEmpty(payload) {
    const abstractSubmission = new AbstractSubmission({...payload})
    return abstractSubmission.isEmpty()
  }
}
