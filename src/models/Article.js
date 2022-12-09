export default class Article {
  constructor({ publication_date, ...rest }) {
    for (let key in rest) {
      this[key] = rest[key]
    }
    this.publication_date =
      typeof publication_date === 'string' ? new Date(publication_date) : new Date()
  }
}
