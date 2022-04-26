import React, { Suspense, lazy} from 'react'
import {useStore} from '../../store'
import { StatusSuccess }  from '../../constants'
import { useGetJSON } from '../../logic/api/fetchData'


const VideoReleaseLazy = ({
  // the wiki page where all the releases are
  url,
  // delay, in ms. By default it appears 1s after
  delay=2000,
}) => {
  const releaseNotified =  useStore((state) => state.releaseNotified)

  // load video release JSON from wiki
  const { data, error, status } = useGetJSON({
    url,
    delay,
    raw: true,
    allowCached: false
  })
  let releases = []
  console.debug('[VideoReleaseLazy] releaseNotified:', releaseNotified, url, status)
  if (error) {
    console.warn('Error loading VideoReleaseLazy JSON data:', error)
    return null
  }
  if (status !== StatusSuccess) {
    return null
  }
  console.debug('[VideoReleaseLazy] received data :',data)

  try {
    releases = JSON.parse(data
      .replace(/^```json\n/, '')
      .replace(/\n```$/, ''))
  } catch (e) {
    console.warn('Error parsing VideoReleaseLazy JSON data:', error)
    return null
  }
  if (!Array.isArray(releases) || !releases.length) {
    console.warn('Error parsing VideoReleaseLazy data: must be a valid array, received:', releases)
    return null
  }
  // if everything is fin, load the VideoRelease__modal
  const VideoRelease = lazy(() => import("./VideoRelease"));
  const currentRelease = releases[0]
  return (
    <Suspense fallback={null}>
      <VideoRelease
        vimeoPlayerUrl={currentRelease.vimeoUrl}
        releaseName={currentRelease.release}
        title={currentRelease.title}
        chaptersContents={currentRelease.chapterContents}
        releaseNotified={releaseNotified}
      />
    </Suspense>
  )
}

export default VideoReleaseLazy
