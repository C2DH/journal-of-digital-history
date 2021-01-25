import React, { useMemo } from 'react'
import { getParsedSteps } from '../../logic/ipynb'

const ImageWrapper = ({ metadata, output }) => {
  const steps = useMemo(() => getParsedSteps({
    steps: metadata?.steps ?? []
  }), [metadata])

  return (
    <div className="ImageWrapper">
      {!!output.data['image/png'] && (
        <img className="w-100" src={`data:image/png;base64,${output.data['image/png']}`} alt='display_data output'/>
      )}
      {!!output.data['image/jpeg'] && (
        <img className="w-100" src={`data:image/jpeg;base64,${output.data['image/jpeg']}`} alt='display_data output'/>
      )}
      {steps.map(({ content }, i) => (
        <figcaption className="px-3 pt-3 pb-1" key={i} dangerouslySetInnerHTML={{
          __html: content
        }} />
      ))}
    </div>
  )
}

export default ImageWrapper
