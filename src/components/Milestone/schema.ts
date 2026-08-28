export const milestoneSchema = {
  type: 'object',
  additionalProperties: {
    type: 'object',
    properties: {
      articles: { type: 'array' },
      callForPapers: { type: 'array' },
      conferences: { type: 'array' },
      releases: { type: 'array' },
    },
    required: ['callForPapers', 'conferences', 'releases'],
    additionalProperties: true,
  },
}
