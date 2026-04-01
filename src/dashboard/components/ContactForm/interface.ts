import { Row } from '../../utils/types'

export type ContactFormData = {
  pid?: string
  from: string
  to: string
  subject: string
  body: string
  status?: 'accepted' | 'declined' | 'abandoned' | 'suspended' | string
}

export interface ContactFormProps {
  row: { open: boolean; action: string; row: Row }
  onClose: () => void
}
