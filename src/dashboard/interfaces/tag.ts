export interface Tag {
  id: number
  data: {
    language: string
    [key: string]: any
  }
  name: string
  category: string
}
