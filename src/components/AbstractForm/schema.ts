export const schema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 10, maxLength: 250 },
    abstract: { type: 'string', minLength: 100, maxLength: 10000 },
    datasets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          link: { type: 'string', minLength: 1, format: 'uri' },
          description: { type: 'string', minLength: 1, maxLength: 1000 },
        },
      },
    },
    contact: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 100 },
        lastName: { type: 'string', minLength: 1, maxLength: 100 },
        affiliation: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', minLength: 1, format: 'email' },
        orcidUrl: {
          type: 'string',
          format: 'uri',
          pattern: '^https?://orcid.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$',
        },
        githubId: {
          type: 'string',
          minLength: 1,
          maxLength: 39,
          pattern: '^(?!-)(?!.*--)[a-z0-9-]{1,39}(?<!-)$',
        },
      },
    },
    contributors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 1, maxLength: 100 },
          lastName: { type: 'string', minLength: 1, maxLength: 100 },
          affiliation: { type: 'string', minLength: 1, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          orcidUrl: {
            type: 'string',
            format: 'uri',
            pattern:
              '^https?://orcid.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$',
          },
        },
      },
    },
    termsAccepted: { type: 'boolean', enum: [true] },
  },
  required: ['title', 'abstract', 'contact', 'termsAccepted'],
}
