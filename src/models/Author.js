export default class Author {
  constructor({ firstname = '', lastname = '', email = '', affiliation = '', orcid, id, isValid } = {}) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.affiliation = affiliation
    this.orcid = orcid
    this.isValid = isValid
  }
}
