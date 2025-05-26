import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { Abstract } from '../interfaces/abstract'

import '../styles/pages/pages.css'

const CallForPapers = () => {
  const { t } = useTranslation()
  const [callforpapers, setCallForPapers] = useState<Abstract[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const callforpaperList = await fetchItems(
          '/api/callofpaper',
          import.meta.env.VITE_API_USERNAME,
          import.meta.env.VITE_API_PASSWORD,
        )
        setCallForPapers(callforpaperList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="callforpapers page">
      <Card
        item="callforpapers"
        headers={['id', 'title', 'deadline_abstract', 'deadline_article']}
        data={callforpapers}
      />
    </div>
  )
}

export default CallForPapers
