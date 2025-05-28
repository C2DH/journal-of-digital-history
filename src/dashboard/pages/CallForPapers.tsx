import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Callforpaper } from '../interfaces/callforpapers'

import '../styles/pages/pages.css'

const CallForPapers = () => {
  const {
    data: callforpapers,
    error,
    loading,
  } = useFetchItems<Callforpaper>('/api/callofpaper', USERNAME, PASSWORD)

  return (
    <div className="callforpapers page">
      <Card
        item="callforpapers"
        headers={['id', 'title', 'deadline_abstract', 'deadline_article']}
        data={callforpapers}
        error={error}
        loading={loading}
      />
    </div>
  )
}

export default CallForPapers
