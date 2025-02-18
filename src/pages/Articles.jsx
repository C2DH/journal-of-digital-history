import React, { useEffect } from 'react'

import '../styles/pages/Articles.scss'
import PropTypes from 'prop-types'
import ArticlesGrid from '../components/Articles/ArticlesGrid'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { usePropsStore } from '../store'
import { StatusError, StatusFetching, StatusSuccess } from '../constants'
import ErrorViewer from './ErrorViewer'

const ProgressLoadingId = 'articles'

const Articles = ({
  match: {
    params: { id: issueId },
  },
}) => {
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

Articles.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default Articles
