import '../styles/pages/pages.css'

import { useEffect } from 'react'

import AccordeonCard from '../components/AccordeonCard/AccordeonCard'
import Card from '../components/Card/Card'
import { useFetchAbstractsByCallForPaper } from '../hooks/useFetchAbstractsByCallforpaper'
import { useItemsStore } from '../store'

const CallForPapers = () => {
  const {
    data: callforpapers,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
    reset,
  } = useItemsStore()

  useEffect(() => {
    reset()
    setParams({ endpoint: 'callforpaper', limit: 10 })
    fetchItems(true)
  }, [setParams, fetchItems])

  const isCallForPapersData =
    callforpapers.length > 0 && callforpapers.some((item) => item.deadline_abstract !== undefined)

  const { abstractsByCallForPaper, abstractsPublished } = useFetchAbstractsByCallForPaper(
    isCallForPapersData ? callforpapers : [],
  )

  return (
    <div className="callforpapers page">
      <div className="empty-space"></div>
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
