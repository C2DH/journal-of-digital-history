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
  
  asText() {
    return [
      `${this.lastname}, ${this.firstname}`,
      this.email ? `(${this.email})` : null,
      this.affiliation ? `- ${this.affiliation}` : null,
      this.orcid ? `- 🆔 orcid:${this.orcid}` : null,
    ].filter(d => d).join(' ')
  }
}
