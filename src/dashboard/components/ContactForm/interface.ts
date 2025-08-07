export type ContactFormData = {
  pid?: string
  from: string
  to: string
  subject: string
  body: string
  status?: 'accepted' | 'declined' | 'abandoned' | 'suspended' | string
}
