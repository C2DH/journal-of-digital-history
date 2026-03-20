import React from 'react'
import {useStore} from '../../store'

const VideoReleaseTrigger = () => {
  const acceptThirdPartyCookies = useStore((state) => state.acceptThirdPartyCookies);
  const setReleaseNotified = useStore((state) => state.setReleaseNotified)
  const setShowCookieBanner = useStore((state) => state.setShowCookieBanner)

  return <a href="#" onClick={(e) => {
    e.preventDefault();
    setReleaseNotified(new Date(-1))

    if (!acceptThirdPartyCookies)
      setShowCookieBanner(true);

  }}>see what's new!</a>
}
export default VideoReleaseTrigger
