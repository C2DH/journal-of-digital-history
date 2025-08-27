export const changeStatusSchema = {
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
