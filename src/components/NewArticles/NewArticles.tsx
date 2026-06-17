import { useGetJSON } from '../../logic/api/fetchData'

const NewArticles = () => {
  const { data, error, status, errorCode } = useGetJSON({
    url: `/api/articles/?limit=2&ordering=-publication_date&status=PUBLISHED`,
  })

  console.log('🚀 ~ file: NewArticles.tsx:5 ~ data:', data)
  return <div style={{ backgroundColor: 'red' }}>Hello</div>
}

export default NewArticles
