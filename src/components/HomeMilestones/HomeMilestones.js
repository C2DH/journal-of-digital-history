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
  console.debug(
    '[HomeMilestones]',
    status,
    status === StatusSuccess,
    error,
    'data:',
    data,
    process.env.REACT_APP_WIKI_EVENTS,
  )
  let jsondata = {}
  let values = []
  let jsondataExtent = [...extent]
  try {
    if (status === StatusSuccess) {
      jsondata = JSON.parse(data.replace(/^```json\n/, '').replace(/\n```$/, ''))
      values = jsondata.values
    }
  } catch (e) {
    console.warn('Error loading timeline data:', e)
  }

  if (jsondata.startDate && jsondata.endDate) {
    jsondataExtent = [new Date(jsondata.startDate), new Date(jsondata.endDate)]
  }

  console.debug('[HomeMilestones]', status, status === StatusSuccess, error, 'values:', jsondata)

  useEffect(() => {
    if (isIntersecting && !seenOnce) {
      console.debug('[HomeMilestones]  isIntersecting')
      setSeenOnce(true)
    }
  }, [isIntersecting, seenOnce])
  return (
    <div ref={ref}>
      {status === StatusSuccess && (
        <MilestoneTimeline milestones={values} isPortrait={isPortrait} extent={jsondataExtent} />
      )}
    </div>
  )
}

export default HomeMilestones
