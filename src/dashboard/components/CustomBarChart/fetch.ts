import { ItemsByStatus } from './interface'

import { useCallForPapersStore, useIssuesStore } from '../../store'
import {
  getAbstractsByStatusAndCallForPapers,
  getAdvanceArticles,
  getArticlesByStatusAndIssues,
} from '../../utils/api/api'
import { abstractStatus } from '../../utils/constants/abstract'
import { articleBarChart } from '../../utils/constants/article'
import { APIResponseObject, Callforpaper, Issue } from '../../utils/types'

/**
 * Fetch the data for the cutom Bar Chart component.
 *
 * @returns A set of formatted data : articleSeries, articleLabels, advanceSeries, abstractSeries and abstractLabels.
 */
export const fetchBarChartData = async () => {
  const { fetchIssues } = useIssuesStore()
  const { fetchCallForPapers } = useCallForPapersStore()

  await fetchCallForPapers(false)
  await fetchIssues(false)
  const issues = useIssuesStore.getState().data as Issue[]
  const callforpapers = useCallForPapersStore.getState().data as Callforpaper[]

  const articleLabels = issues.map((issue) => issue.pid)
  const abstractLabels = callforpapers.map((cfp) => cfp.title)

  const articleSeriesRaw = await Promise.all(
    articleBarChart.map(async (status) => {
      const data = await Promise.all(
        issues.map(async (issue: Issue) => {
          let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
          res = await getArticlesByStatusAndIssues(issue.id, status.value)
          return res.count || 0
        }),
      )
      return { data, label: status.label } as ItemsByStatus
    }),
  )

  const formattedArticleData = issues.map((issue, idx) => {
    const obj: Record<string, any> = {
      issueName: issue.name,
      pid: issue.pid,
    }
    articleBarChart.forEach((status, sIdx) => {
      obj[status.label] = articleSeriesRaw[sIdx].data[idx]
    })
    return obj
  })

  const advanceArticles = await getAdvanceArticles()
  const advanceArticlesFormat = {
    issueName: 'Advance Articles',
    pid: 'advance',
    Writing: 0,
    'Technical review': 0,
    'Peer review': 0,
    'Design review': 0,
    Published: advanceArticles.count,
  }

  const abstractSeriesRaw = await Promise.all(
    abstractStatus.map(async (status) => {
      const data = await Promise.all(
        callforpapers.map(async (cfp: Callforpaper) => {
          let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
          res = await getAbstractsByStatusAndCallForPapers(cfp.id, status.value)
          return res.count || 0
        }),
      )
      return { data, label: status.label } as ItemsByStatus
    }),
  )

  const formattedAbstractData = callforpapers.map((cfp, idx) => {
    const obj: Record<string, any> = {
      cfpTitle: cfp.title,
      id: cfp.id,
    }
    abstractStatus.forEach((status, sIdx) => {
      obj[status.label] = abstractSeriesRaw[sIdx].data[idx]
    })
    return obj
  })

  return {
    articleSeries: formattedArticleData,
    articleLabels,
    advanceSeries: [advanceArticlesFormat],
    abstractSeries: formattedAbstractData,
    abstractLabels,
  }
}
