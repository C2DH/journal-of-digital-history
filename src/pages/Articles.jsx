import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import '../styles/pages/Articles.scss'
import ArticlesGrid from '../components/Articles/ArticlesGrid'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { usePropsStore } from '../store'
import { StatusError, StatusFetching, StatusSuccess } from '../constants/globalConstants'
import ErrorViewer from './ErrorViewer'

const ProgressLoadingId = 'articles'

const Articles = () => {
  const { id: issueId } = useParams()
  console.debug('[Articles] match.params.id/issueId:', issueId)
  const [setLoadingProgress, setLoadingProgressFromEvent] = usePropsStore((state) => [
    state.setLoadingProgress,
    state.setLoadingProgressFromEvent,
  ])
  const {
    data: issues,
    error: errorIssues,
    status: statusIssues,
  } = useQuery({
    queryKey: ['/api/issues'],
    queryFn: () =>
      axios
        .get('/api/issues?ordering=-pid', {
          timeout: 10000,
          onDownloadProgress: (e) => setLoadingProgressFromEvent(e, ProgressLoadingId, 0.5, 0),
        })
        .then((res) => res.data.results),
  })
  const {
    data: articles,
    error: errorArticles,
    status: statusArticles,
  } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: () =>
      axios
        .get('/api/articles?limit=500', {
          timeout: 10000,
          onDownloadProgress: (e) => setLoadingProgressFromEvent(e, ProgressLoadingId, 0.5, 0.5),
        })
        .then((res) => res.data.results),
    enabled: statusIssues === StatusSuccess,
  })

  useEffect(() => {
    if (statusIssues === StatusFetching) {
      setLoadingProgress(0.05, ProgressLoadingId)
    } else if (statusArticles === StatusSuccess) {
      setLoadingProgress(1, ProgressLoadingId)
    } else if (statusArticles === StatusError) {
      setLoadingProgress(0, ProgressLoadingId)
    }
  }, [statusIssues, statusArticles])

  console.debug(
    '[Articles] \n- statusIssues:',
    statusIssues,
    '\n- issues:',
    Array.isArray(issues),
    issues,
    '\n- statusArticles:',
    statusArticles,
    '\n- articles:',
    Array.isArray(articles),
    articles,
  )

  return (
    <>
      {statusIssues === StatusError && (
        <ErrorViewer error={errorIssues} errorCode={errorIssues.code} />
      )}
      {statusArticles === StatusError && (
        <ErrorViewer error={errorArticles} errorCode={errorArticles.code} />
      )}
      {statusIssues !== StatusError && statusArticles !== StatusError && (
        <ArticlesGrid status={statusArticles} items={articles} issueId={issueId} issues={issues} />
      )}
    </>
  )
}


export default Articles
