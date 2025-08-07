import { useEffect, useState } from 'react'

import api from '../utils/helpers/setApiHeaders'
import { AbstractsByCallforpaperValue, AbstractsPublished } from '../utils/types'

export function useFetchAbstractsByCallForPaper(callforpapers: any[]) {
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

  return { abstractsByCallForPaper, abstractsPublished }
}
