import React, { Suspense, lazy } from 'react'
import { useStore } from '../../store'
import { StatusSuccess } from '../../constants'
import { useGetJSON } from '../../logic/api/fetchData'

// if everything is fine, load the VideoRelease__modal
const VideoRelease = lazy(() => import('./VideoRelease'))

/**
 * This component is a lazy-loaded wrapper for the VideoRelease component.
 * It loads the latest video release JSON from a wiki page and if the user has not been notified about the new release, it passes the data to the VideoRelease component.
 * If the current release start date is earlier than the releaseNotified date, it returns null.
 * Otherwise, it renders the VideoRelease component with the current release data.
 *
 * @param {Object} props - The  component props.
 * @param {boolean} [props.isMobile=false] - A boolean indicating whether the user is on a mobile device.
 * @param {string} props.url - The URL of the wiki page where the video release JSON is located.
 * @param {number} [props.delay=2000] - The delay, in milliseconds, before the JSON data is loaded.
 * @returns {JSX.Element|null} - The VideoRelease component wrapped in a Suspense component, or null if there is an error or the current release start date is earlier than the releaseNotified date.
 */
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
