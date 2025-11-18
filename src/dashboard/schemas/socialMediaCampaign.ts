export const socialMediaCampaign = {
  type: 'object',
  properties: {
    repository_url: { type: 'string', format: 'uri' },
    article_url: { type: 'string', format: 'uri' },
    schedule_main: {
      type: 'array',
      items: { type: 'string', format: 'date-time' },
      minItems: 1,
    },
  },
  required: ['repository_url', 'article_url', 'schedule_main'],
  additionalProperties: false,
}

export const tweetCampaign = {
  type: 'object',
  properties: {
    tweets: {
      type: 'array',
      items: { type: 'string', minLength: 1, maxLength: 300 },
      minItems: 1,
    },
  },
  additionalProperties: false,
}
