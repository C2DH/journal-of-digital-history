import React from 'react'
import {useStore} from '../../store'

const VideoReleaseTrigger = () => {
  const setReleaseNotified = useStore((state) => state.setReleaseNotified)
  return <a href="#" onClick={(e) => {
    e.preventDefault();
    setReleaseNotified(new Date(-1))
  }}>see what's new!</a>
}
export default VideoReleaseTrigger
