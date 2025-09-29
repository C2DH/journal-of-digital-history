export const contactFormSchema = {
  type: 'object',
  properties: {
    pid: { type: 'string', pattern: '^[A-Za-z0-9]{12}$' },
    from: { type: 'string', format: 'email' },
    to: { type: 'string', format: 'email' },
    subject: { type: 'string', minLength: 1 },
    body: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['accepted', 'declined', 'abandoned', 'suspended'] },
  },
  required: ['from', 'to', 'subject', 'body', 'status'],
  additionalProperties: false,
}
