import React, {useRef, useState} from 'react'
import Vimeo from '@u-wave/react-vimeo'
import { useBoundingClientRect } from '../../hooks/graphics'
import VideoReleaseButton from './VideoReleaseButton'
import '../../styles/components/VideoRelease.scss'


const VideoRelease= ({
  // releaseNotified=false,
  title='',
  releaseName='Serenity',
  chaptersContents={},
  vimeoPlayerUrl,
}) => {
  const [{width, height}, ref] = useBoundingClientRect()
  const playerRef = useRef()
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  console.debug('[VideoRelease__modal] bbox:', width, height)

  const onReady = (player) => {
    if(!playerRef.current) {
      player.on('chapterchange', (c) => {
        console.debug('[VideoRelease__modal] chapter changed:', c)
        setCurrentChapter(c)
      })
      player.getChapters().then(function(chapters) {
        // `chapters` indicates an array of chapter objects
        console.debug('[VideoRelease__modal] player.getChapters():', chapters)
        setChapters(chapters)

      }).catch(function(error) {
        // An error occurred
        console.warn('[VideoRelease__modal] error playback', error)
      });
      playerRef.current = player
    }


  }

  const gotoChapter = (chapter) => {
    playerRef.current.setCurrentTime(chapter.startTime)
      .then(() => {
        playerRef.current.play()
      })
  }

  return (
    <div className="VideoRelease">
      <div className="VideoRelease__modal shadow-lg">
        <VideoReleaseButton />
        <aside className="VideoRelease__modal__aside p-4">
          <p>{releaseName}</p>
          <h1>{title}</h1>
          <ul >
          {chapters.map((chapter) => {
            const isActive = currentChapter && chapter.index === currentChapter.index
            return (
              <li key={chapter.index}
                onClick={() => gotoChapter(chapter)}
                className={isActive ? 'active': ''}
              >
               <span>{chapter.title}</span>
              </li>
            )
          })}
          </ul>
        </aside>
        <div className="VideoRelease__modal__video" ref={ref}>
          <Vimeo
            video={vimeoPlayerUrl}
            responsive
            muted
            className="position-absolute"
            style={{
              width, height
            }}
            onReady={onReady}
            autoplay
          />
        </div>
        <div className="d-flex align-items-center px-3 VideoRelease__modal__description">
          {currentChapter ? (
            <span dangerouslySetInnerHTML={{
              __html: Array.isArray(chaptersContents[currentChapter.title])
                ? chaptersContents[currentChapter.title].join(' ')
                : '...'
            }} />
          ): null}
        </div>
      </div>
    </div>
  )
}

export default VideoRelease
