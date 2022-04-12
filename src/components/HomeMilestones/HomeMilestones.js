import React from 'react'
import { useOnScreen } from '../../hooks/graphics'
import { useGetJSON } from '../../logic/api/fetchData'
import { StatusSuccess} from '../../constants'
import MilestoneTimeline from '../MilestoneTimeline'


const HomeMilestones = ({ isPortrait, extent }) => {
  const [{ isIntersecting }, ref] = useOnScreen()
  const { data, status, error } = useGetJSON({
    url: isIntersecting
      ? process.env.REACT_APP_WIKI_EVENTS
      : null,
    raw: true,
    allowCached: false
  })

  let values = []
  try {
    if (status === StatusSuccess) {
      values = JSON.parse(data
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '')
      )
    }
  } catch (e) {
    console.warn('Error loading timeline data:', e)
  }

  console.debug('[HomeMilestones]', status, error, 'values:', values)

  return (
    <div ref={ref}>
      <MilestoneTimeline
        milestones={values}
        isPortrait={isPortrait}
        extent={extent}
      />
    </div>
  )
}

export default HomeMilestones
