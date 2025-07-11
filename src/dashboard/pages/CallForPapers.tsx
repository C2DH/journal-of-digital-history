import { useEffect, useState } from 'react'
import '../styles/pages/pages.css'

import AccordeonCard from '../components/AccordeonCard/AccordeonCard'
import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import api from '../utils/helpers/setApiHeaders'
import { Abstract, Callforpaper } from '../utils/types'

type AbstractsByCallforpaperValue = {
  title?: string
  data: Abstract[]
  error?: string
}

type AbstractsPublished = {
  title?: string
  data: Abstract[]
  error?: string
}

const CallForPapers = () => {
  const {
    data: callforpapers,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Callforpaper>('callforpaper', 10)
  const [abstractsByCallForPaper, setAbstractsByCallForPaper] = useState<
    Record<number, AbstractsByCallforpaperValue>
  >({})
  const [abstractsPublished, setAbstractsPublished] = useState<AbstractsPublished>({ data: [] })

  useEffect(() => {
    callforpapers.forEach((callforpaper) => {
      if (!abstractsByCallForPaper[callforpaper.id]) {
        api
          .get(`/api/abstracts/?callpaper=${callforpaper.id}&status=!PUBLISHED`)
          .then((res) => {
            const data = res.data
            setAbstractsByCallForPaper((prev) => ({
              ...prev,
              [callforpaper.id]: {
                title: callforpaper.title,
                data: data.results || [],
                error: undefined,
              },
            }))
          })
          .catch((err) => {
            setAbstractsByCallForPaper((prev) => ({
              ...prev,
              [callforpaper.id]: {
                data: [],
                error: err.message || 'Failed to fetch abstracts',
              },
            }))
          })
      }
    })
    api
      .get(`/api/abstracts?status=PUBLISHED&limit=1000`)
      .then((res) => {
        const data = res.data
        setAbstractsPublished(() => ({
          title: 'Abstracts published',
          data: data.results || [],
          error: undefined,
        }))
      })
      .catch((err) => {
        setAbstractsPublished(() => ({
          data: [],
          error: err.message || 'Failed to fetch abstracts',
        }))
      })
  }, [callforpapers])

  return (
    <div className="callforpapers page">
      <Card
        item="callforpapers"
        headers={['id', 'title', 'deadline_abstract', 'deadline_article', 'folder_name']}
        data={callforpapers}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
      {Object.entries(abstractsByCallForPaper)
        .sort((a, b) => Number(b[0]) - Number(a[0])) //inverse order by callforpaperId
        .map(([callforpaperId, abstracts]) => (
          <div key={callforpaperId}>
            <AccordeonCard
              title={abstracts.title || ''}
              item={`abstracts`}
              headers={['pid', 'title', 'status']}
              data={abstracts.data}
              error={abstracts.error}
            />
          </div>
        ))}
      <AccordeonCard
        title={abstractsPublished.title || ''}
        item={`abstracts`}
        headers={['pid', 'title', 'status']}
        data={abstractsPublished.data || []}
        error={abstractsPublished.error}
      />
    </div>
  )
}

export default CallForPapers
