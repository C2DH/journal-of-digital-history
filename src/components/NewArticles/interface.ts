import { Fingerprint } from '../../dashboard/utils/types'

export interface NewArticleCardProps {
  article: {
    abstract: {
      pid: string
      title: string
      contact_firstname: string
      contact_lastname: string
    }
    contributor: [{ content: string }]
    publication_date: string
    issue: {
      id: number
      name: string
      pid: string
      publication_date: string
    }
    fingerprint: Fingerprint
  }
}
