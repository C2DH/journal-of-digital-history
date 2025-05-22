import React, { useMemo } from 'react'
import { getParsedSteps } from '../../logic/ipynb'

const ImageWrapper = ({ metadata, output, figure }) => {
  const steps = useMemo(() => getParsedSteps({ steps: [{
    source: metadata?.source ?? []
  }]}), [metadata])

  return (
    <div className="ImageWrapper">
      {!!output.data['image/png'] && (
        <img className="w-100" src={`data:image/png;base64,${output.data['image/png']}`} alt='display_data output'/>
      )}
      {!!output.data['image/jpeg'] && (
        <img className="w-100" src={`data:image/jpeg;base64,${output.data['image/jpeg']}`} alt='display_data output'/>
      )}

      {steps.map(({ content }, i) => (
        <figcaption className="px-2 pt-2 pb-1 position-relative" key={i}>
          <div className="ImageWrapper_figcaption_num"><div className="mr-2">Fig. {figure.num}</div></div>
          <div dangerouslySetInnerHTML={{
            __html: content
          }} />
        </figcaption>
      ))}
    </div>
  )
}

export default ImageWrapper
