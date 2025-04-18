import React, { Suspense, lazy } from 'react'
import { useStore } from '../../store'
import { StatusSuccess } from '../../constants/globalConstants'
import { useGetJSON } from '../../logic/api/fetchData'

const VideoReleaseLazy = ({
  isMobile = false,
  // the wiki page where all the releases are
  url,
  // delay, in ms. By default it appears 1s after
  delay = 2000,
}) => {
  const releaseNotified = useStore((state) => state.releaseNotified)
  // load video release JSON from wiki
  const { data, error, status } = useGetJSON({
    url: isMobile ? null : url,
    delay,
    raw: true,
    allowCached: false,
  })
  let releases = []
  if (error) {
    console.warn('Error loading VideoReleaseLazy JSON data:', error)
    return null
  }
  if (status !== StatusSuccess) {
    return null
  }
  console.debug('[VideoReleaseLazy] received data :', data.length)

  try {
    releases = JSON.parse(data.replace(/^```json\n/, '').replace(/\n```$/, ''))
  } catch (e) {
    console.warn('Error parsing VideoReleaseLazy JSON data:', error)
    return null
  }
  if (!Array.isArray(releases) || !releases.length) {
    console.warn('Error parsing VideoReleaseLazy data: must be a valid array, received:', releases)
    return null
  }
  const currentRelease = releases[0]

  if (currentRelease.startDate < releaseNotified) {
    console.info('%creleaseNotified', 'font-weight: bold', 'already notified, skipping.')
    return null
  } else {
    console.info(
      '%creleaseNotified',
      'font-weight: bold',
      'please notify!',
      '\n - releaseNotified date:',
      releaseNotified,
      '\n - currentRelease.startTime:',
      currentRelease.startDate,
    )
  }
  // if everything is fin, load the VideoRelease__modal
  const VideoRelease = lazy(() => import('./VideoRelease'))

  return (
    <Suspense fallback={null}>
      <VideoRelease
        vimeoPlayerUrl={currentRelease.vimeoUrl}
        releaseName={currentRelease.release}
        title={currentRelease.title}
        chaptersContents={currentRelease.chapterContents}
      />
    </Suspense>
  )
}

export default VideoReleaseLazy
