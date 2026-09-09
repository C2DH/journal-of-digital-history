import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusSuccess } from '../../constants/globalConstants'
import { validateForm } from '../../dashboard/utils/helpers/schema'
import { milestoneSchema } from './schema'

const timeout = import.meta.env.VITE_API_TIMEOUT || 0

const useMilestoneFetch = () => {
  const { t } = useTranslation()

  const {
    data: [dataGithub, articles],
    errors: [errorGithub, errorArticles],
    statuses: [statusGithub],
    isLoading,
  } = useQueries({
    queries: [
      {
        queryKey: [import.meta.env.VITE_WIKI_EVENTS],
        queryFn: () =>
          axios.get(import.meta.env.VITE_WIKI_EVENTS, { timeout }).then(({ data }) => data),
      },
      {
        queryKey: ['/api/articles?limit=500&status=PUBLISHED'],
        queryFn: () =>
          axios
            .get('/api/articles?limit=500&status=PUBLISHED', { timeout })
            .then(({ data }) => data),
      },
    ],
    // merge both query results into one shape consumed below
    combine: (results) => ({
      data: results.map((result) => result.data),
      errors: results.map((result) => result.error),
      statuses: results.map((result) => result.status),
      isLoading: results.some((result) => result.isLoading),
    }),
  })

  const { parsedTimeline, timelineError } = useMemo(() => {
    if (!dataGithub) return {}

    let json = {}

    //Validate Github Data
    try {
      if (statusGithub !== StatusSuccess) {
        return { parsedTimeline: null, timelineError: null }
      }

      if (!dataGithub || typeof dataGithub !== 'string') {
        return {
          parsedTimeline: null,
          timelineError: t('milestone.error.emptyData'),
        }
      }

      if (statusGithub === StatusSuccess) {
        json = JSON.parse(dataGithub.replace(/^```json\n/, '').replace(/\n```$/, ''))
      }
    } catch (e) {
      return {
        parsedTimeline: null,
        timelineError: t('milestone.error.notValid'),
      }
    }

    const { valid, errors } = validateForm(json, milestoneSchema)

    if (!valid) {
      const detail = errors?.[0]?.message ?? t('milestone.error.structure')
      return {
        parsedTimeline: null,
        timelineError: `${t('milestone.error.malformed')} ${detail}`,
      }
    }

    // Merging data from API and Github
    const articlesByYear = (articles?.results ?? []).reduce((acc, article) => {
      const year = DateTime.fromISO(article.publication_date).year
      const issue = article.issue.pid.replace(/jdh0+(\d+)/, (m, n) => n)
      const title = article.data.title[0].replace('# ', '')

      if (!acc[year]) {
        acc[year] = []
      }

      acc[year].push({
        date: article.publication_date,
        title: title,
        issue: issue,
        pid: article.abstract.pid,
      })

      return acc
    }, {})

    const articlesAndGithubData = Object.keys(json).reduce((acc, year) => {
      acc[year] = {
        ...json[year],
        articles: articlesByYear[year] ?? [],
      }
      return acc
    }, {})

    return { parsedTimeline: articlesAndGithubData, timelineError: null }
  }, [articles, dataGithub])

  return { parsedTimeline, timelineError, errorGithub, errorArticles, isLoading }
}

export default useMilestoneFetch
