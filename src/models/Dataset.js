export default class Dataset {
  constructor({ id, url = '', license, type, description, isValid } = {}) {
    this.id = id
    this.url = url
    this.description = description
    this.license = license
    this.type = type
    this.isValid = isValid
  }
}
