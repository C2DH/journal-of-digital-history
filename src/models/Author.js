export class AuthorSocialMedia {
  constructor({ githubId = '', id } = {}) {
    this.id = id
    this.githubId = githubId
  }

  asText() {
    return [
      this.githubId ? `🆔 githubId:${this.githubId}` : null,
    ].filter(d => d).join(' ')
  }

}

export default class Author {
  constructor({ firstname = '', lastname = '', email = '', affiliation = '', orcid = '', socialMedia= new AuthorSocialMedia(), id, isValid } = {}) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.affiliation = affiliation
    this.orcid = orcid
    this.socialMedia= socialMedia
    this.isValid = isValid
  }

  asText() {
    return [
      `${this.lastname}, ${this.firstname}`,
      this.email ? `(${this.email})` : null,
      this.affiliation ? `- ${this.affiliation}` : null,
      this.orcid ? `- 🆔 orcid:${this.orcid}` : null,
      this.socialMedia.asText(),
    ].filter(d => d).join(' ')
  }
}
