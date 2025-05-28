export interface Issue {
  id: number
  pid: string
  name: string
  description: string
  creation_date: string
  publication_date: string
  cover_date: string
  status: string
  data: Record<string, any>
  volume: number
  issue: number
  is_open_ended: boolean
}
