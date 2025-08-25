export const changeAbstractSchema = {
  type: 'object',
  properties: {
    pids: { type: 'string' },
    status: { type: 'string', enum: ['accepted', 'declined', 'abandoned', 'suspended'] },
  },
  required: ['pids', 'status'],
  additionalProperties: false,
}
