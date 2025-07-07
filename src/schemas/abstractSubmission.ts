export const submissionFormSchema = {
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
        required: ['link', 'description'],
      },
      minItems: 0,
      maxItems: 10,
    },
    authors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          firstname: { type: 'string', minLength: 1, maxLength: 100 },
          lastname: { type: 'string', minLength: 1, maxLength: 100 },
          affiliation: { type: 'string', minLength: 1, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          confirmEmail: {
            anyOf: [
              { type: 'string', format: 'email' },
              { type: 'null' },
              { type: 'string', maxLength: 0 },
            ],
          },
          orcidUrl: {
            type: 'string',
            format: 'uri',
            pattern: '^https?://orcid.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$',
          },
          githubId: {
            anyOf: [
              {
                type: 'string',
                minLength: 1,
                maxLength: 39,
                pattern: '^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$',
              },
              { type: 'null' },
              { type: 'string', maxLength: 0 },
            ],
          },
          blueskyId: {
            anyOf: [
              {
                type: 'string',
                minLength: 1,
                maxLength: 255,
                pattern:
                  '^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$',
              },
              { type: 'null' },
              { type: 'string', maxLength: 0 },
            ],
          },
          facebookId: {
            anyOf: [
              { type: 'string', minLength: 5, maxLength: 50, pattern: '^[a-zA-Z0-9._]{5,50}' },
              { type: 'null' },
              { type: 'string', maxLength: 0 },
            ],
          },
          primaryContact: { type: 'boolean', enum: [true, false] },
        },
        required: ['firstname', 'lastname', 'affiliation', 'email', 'orcidUrl'],
      },
      minItems: 1,
      maxItems: 10,
      atLeastOneGithubId: true,
      onlyOnePrimaryContact: true,
      requireConfirmEmailForPrimaryContact: true,
    },
    languagePreference: {
      type: 'string',
      enum: ['Python', 'R', 'Default'],
      default: 'Python',
    },
    termsAccepted: { type: 'boolean', enum: [true] },
  },
  required: ['title', 'abstract', 'authors', 'termsAccepted'],
}
