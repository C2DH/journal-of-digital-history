import { getArticlesByStatus } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'

export const fetchPieChartData = async () => {
  try {
    const counts = await Promise.all(
      articlePieChart.map(async (status) => {
        const res = await getArticlesByStatus(status.value)
        return {
          label: status.label,
          value: res.count || 0,
        }
      }),
    )
    return counts as { label: string; value: number }[]
  } catch (error) {
    console.error('Error Fetching count of articles by status:', error)
  }
}
