import React, { useMemo } from 'react'
import { markdownParser } from '../../logic/ipynb'


const ArticleCellTextObject = ({ metadata, children, progress }) => {
  const objectContents = useMemo(() => {
    const textMetadata = metadata.jdh?.text?.source
    if (Array.isArray(textMetadata)) {
      return markdownParser.render(textMetadata.join('\n'))
    }
    return null
  }, [metadata])

  return (
    <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
  )
}

export default ArticleCellTextObject
