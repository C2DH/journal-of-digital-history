export const contactFormSchema = {
  type: 'object',
  properties: {
    from: { type: 'string', format: 'email' },
    to: { type: 'string', format: 'email' },
    subject: { type: 'string', minLength: 1 },
    body: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['accepted', 'declined', 'abandoned', 'suspended'] },
  },
  required: ['from', 'to', 'subject', 'body', 'status'],
  additionalProperties: false,
}
