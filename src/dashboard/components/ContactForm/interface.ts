export type ContactFormData = {
  from: string
  to: string
  subject: string
  body: string
  status: 'accepted' | 'declined' | 'abandoned' | 'suspended' | string
}
