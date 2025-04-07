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
      minItems: 0,
      maxItems: 10,
      required: ['link', 'description'],
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
        blueskyId: {
          anyOf: [
            { type: 'string', minLength: 1, maxLength: 27, pattern: '^@[a-zA-Z0-9_]{1,15}.bsky.social' },
            { type: 'null' }, 
            { type: 'string', maxLength: 0 }, 
          ],
        },
        facebookId: {
          anyOf: [
            { type: 'string', minLength: 5, maxLength: 50, pattern: '^[a-zA-Z0-9._]{5,50}'},
            { type: 'null' },
            { type: 'string', maxLength: 0 }, 
          ],
        },
      },
      required: ['firstName', 'lastName', 'affiliation', 'email', 'orcidUrl', 'githubId'], 
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
            pattern: '^https?://orcid.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$',
          },
        },
      },
      minItems: 1,
      maxItems: 10,
      required: ['firstName', 'lastName', 'affiliation', 'email', 'orcidUrl'],
    },
    termsAccepted: { type: 'boolean', enum: [true] },
  },
  required: ['title', 'abstract', 'contact', 'contributors', 'termsAccepted'],
};