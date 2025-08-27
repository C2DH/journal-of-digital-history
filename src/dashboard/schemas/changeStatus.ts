export const abstractStatusSchema = {
  type: 'object',
  properties: {
    pids: { type: 'array', items: { type: 'string' }, minItems: 1 },
    status: {
      type: 'string',
      enum: ['accepted', 'declined', 'abandoned', 'suspended', 'submitted'],
    },
  },
  required: ['pids', 'status'],
  additionalProperties: false,
}

export const articleStatusSchema = {
  type: 'object',
  properties: {
    pids: { type: 'array', items: { type: 'string' }, minItems: 1 },
    status: {
      type: 'string',
      enum: [
        'draft',
        'technical_review',
        'peer_review',
        'design_review',
        'copyediting',
        'social',
        'published',
        'archived',
      ],
    },
  },
  required: ['pids', 'status'],
  additionalProperties: false,
}
