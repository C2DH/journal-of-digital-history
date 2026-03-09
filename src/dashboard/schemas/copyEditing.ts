export const contactFormCopyEditingSchema = {
  type: 'object',
  properties: {
    pid: { type: 'string', pattern: '^[A-Za-z0-9]{12}$' },
    from: { type: 'string', format: 'email' },
    subject: { type: 'string', minLength: 1 },
    body: { type: 'string', minLength: 1 },
  },
  required: ['pid', 'from', 'subject', 'body'],
  additionalProperties: false,
}
