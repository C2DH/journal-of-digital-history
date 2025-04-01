export const schema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 10, maxLength: 250 },
    abstract: { type: 'string', minLength: 100, maxLength: 10000 },
    firstName: { type: 'string', minLength: 1, maxLength: 100 },
    lastName: { type: 'string', minLength: 1, maxLength: 100 },
    affiliation: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    orcidUrl: { type: 'string', format: 'uri', pattern: "^https?://orcid.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$"},
    githubId: { type: 'string', minLength: 1, maxLength: 39, pattern: "^(?!-)(?!.*--)[a-z0-9-]{1,39}(?<!-)$" },
    termsAccepted: { type: 'boolean' },
  },
  required: ['title', 'abstract'],
}
