import React from 'react'
import { Button } from 'react-bootstrap'
import { X } from 'react-feather'

const VideoReleaseButton = ({ onClick }) => {
  return (
    <Button
      className="VideoReleaseButton"
      variant="outline-secondary"
      onClick={onClick}
      data-test="video-release-button"
    >
      <X size={15} strokeWidth={3} />
    </Button>
  )
}

export default VideoReleaseButton
