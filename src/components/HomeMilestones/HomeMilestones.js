import React, { useEffect, useState } from 'react'
import { useOnScreen } from '../../hooks/graphics'
import { useGetJSON } from '../../logic/api/fetchData'
import { StatusSuccess } from '../../constants'
import MilestoneTimeline from '../MilestoneTimeline'

const HomeMilestones = ({ isPortrait, extent }) => {
  const [{ isIntersecting }, ref] = useOnScreen()
  const [seenOnce, setSeenOnce] = useState(false)
  const { data, status, error } = useGetJSON({
    url: seenOnce ? process.env.REACT_APP_WIKI_EVENTS : null,
    raw: true,
    allowCached: true,
  })

  let values = []
  try {
    if (status === StatusSuccess) {
      values = JSON.parse(data.replace(/^```json\n/, '').replace(/\n```$/, ''))
    }
  } catch (e) {
    console.warn('Error loading timeline data:', e)
  }

  console.debug('[HomeMilestones]', status, status === StatusSuccess, error, 'values:', values)

  useEffect(() => {
    if (isIntersecting && !seenOnce) {
      console.debug('[HomeMilestones]  isIntersecting')
      setSeenOnce(true)
    }
  }, [isIntersecting, seenOnce])
  return (
    <div ref={ref}>
      {status === StatusSuccess && (
        <MilestoneTimeline milestones={values} isPortrait={isPortrait} extent={extent} />
      )}
    </div>
  )
}

export default HomeMilestones
