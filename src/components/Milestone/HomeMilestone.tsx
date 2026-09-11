import hljs from 'highlight.js'
import parse from 'html-react-parser'
import { useTranslation } from 'react-i18next'

import useMilestoneFetch from './fetch'
import Milestone from './Milestone'

const HomeMilestone = () => {
  const { t } = useTranslation()
  const { parsedTimeline, timelineError, errorArticles, errorGithub, isLoading } =
    useMilestoneFetch()

  if (isLoading) {
    return null
  }

  if (timelineError || errorArticles || errorGithub || !parsedTimeline) {
    const err = hljs.highlight(
      'typescript',
      `${t('milestone.error.general')} ${timelineError || errorArticles || errorGithub}`,
    )
    return (
      <pre className="hljs" data-test="error-message">
        <div>{parse(err.value)}</div>
      </pre>
    )
  }

  return <Milestone timeline={parsedTimeline} />
}

export default HomeMilestone
