import Vimeo from '@u-wave/react-vimeo'
import { useRef, useState } from 'react'
import { animated, config, useSpring } from 'react-spring'
import { useBoundingClientRect } from '../../hooks/graphics'
import { useStore } from '../../store'
import '../../styles/components/VideoRelease.scss'
import VideoReleaseButton from './VideoReleaseButton'

const VideoRelease = ({
  // releaseNotified=false,
  title = '',
  releaseName = 'Serenity',
  chaptersContents = {},
  vimeoPlayerUrl,
}) => {
  const setReleaseNotified = useStore((state) => state.setReleaseNotified)
  const [{ width, height }, ref] = useBoundingClientRect()
  const playerRef = useRef()
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [modalStyle, apiModalStyle] = useSpring(() => ({
    opacity: 0,
    y: 50,
    config: config.gentle,
    onRest: ({ value }) => {
      console.debug('[VideoRelease] animation done.', value)
      if (value.opacity === 0) {
        // remove!
        setReleaseNotified()
      }
    },
  }))

  const onReady = (player) => {
    if (!playerRef.current) {
      player.on('chapterchange', (c) => {
        console.debug('[VideoRelease] chapter changed:', c)
        setCurrentChapter(c)
      })
      player
        .getChapters()
        .then(function (chapters) {
          // `chapters` indicates an array of chapter objects
          console.debug('[VideoRelease] player.getChapters():', chapters)
          setChapters(chapters)
        })
        .catch(function (error) {
          // An error occurred
          console.warn('[VideoRelease] error playback', error)
        })
      playerRef.current = player
      apiModalStyle.start({ opacity: 1, y: 0 })
    }
  }

  const gotoChapter = (chapter) => {
    playerRef.current.setCurrentTime(chapter.startTime).then(() => {
      playerRef.current.play()
    })
  }

  const onClose = () => {
    console.debug('[VideoRelease] @onClose, setReleaseNotified:', new Date())
    apiModalStyle.start({ opacity: 0, y: 50 })
  }

  return (
    <animated.div style={modalStyle} className="VideoRelease">
      <div className="VideoRelease__modal shadow-lg" data-testid="video-release-modal">
        <VideoReleaseButton onClick={onClose} />
        <aside className="VideoRelease__modal__aside p-4">
          <p>{releaseName}</p>
          <h1>{title}</h1>
          <ul>
            {chapters.map((chapter) => {
              const isActive = currentChapter && chapter.index === currentChapter.index
              return (
                <li
                  key={chapter.index}
                  onClick={() => gotoChapter(chapter)}
                  className={isActive ? 'active' : ''}
                >
                  <span>{chapter.title}</span>
                </li>
              )
            })}
          </ul>
        </aside>
        <animated.div
          className="VideoRelease__modal__video"
          ref={ref}
          style={{
            opcity: modalStyle.opacity,
          }}
        >
          <Vimeo
            video={vimeoPlayerUrl}
            responsive
            muted
            className="position-absolute"
            style={{
              width,
              height,
            }}
            onReady={onReady}
            autoplay
          />
        </animated.div>
        <div className="d-flex align-items-center px-3 VideoRelease__modal__description">
          {currentChapter ? (
            <span
              dangerouslySetInnerHTML={{
                __html: Array.isArray(chaptersContents[currentChapter.title])
                  ? chaptersContents[currentChapter.title].join(' ')
                  : '...',
              }}
            />
          ) : null}
        </div>
      </div>
    </animated.div>
  )
}

export default VideoRelease
