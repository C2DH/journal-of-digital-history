import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Callforpaper } from '../utils/types'

import '../styles/pages/pages.css'

const CallForPapers = () => {
  const {
    data: callforpapers,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Callforpaper>('/callofpaper', 10)

  return (
    <div className="callforpapers page">
      <Card
        item="callforpapers"
        headers={['id', 'title', 'deadline_abstract', 'deadline_article']}
        data={callforpapers}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  )
}

export default CallForPapers
