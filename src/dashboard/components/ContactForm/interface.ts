export type ContactFormData = {
  pid: string
  from: string
  to: string
  subject: string
  message: string
  status?: 'accepted' | 'declined' | 'abandoned' | 'suspended' | string
}
