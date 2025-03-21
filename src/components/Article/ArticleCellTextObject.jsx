import React, { useMemo } from 'react'
import { markdownParser } from '../../logic/ipynb'

const emptyHighlight = ({ idx }) => {
  console.warn(
    'Ouch! No listener has been provied for idx:', idx,
    'Please make sure to pass that funcion as a property, e.g.',
    '<ArticleCellTextObject onHighlight={yourAwesomeMethod} />'
  )
}
const ArticleCellTextObject = ({ metadata, onHighlight = emptyHighlight }) => {
  const objectContents = useMemo(() => {
    const textMetadata = metadata.jdh?.text?.source
    if (Array.isArray(textMetadata)) {
      return markdownParser.render(textMetadata.join('\n'))
    }
    return null
  }, [metadata])

  /*
    Get special link out of markdown
  */
  const handleClick = (e) => {
    const href = e.target.getAttribute('href');
    if (href && href.indexOf('@') === 0) {
      const matchIndices = href.match(/^@([\d,]+)$/)
      e.nativeEvent.stopImmediatePropagation()
      e.preventDefault();

      if (!matchIndices) {
        console.warn('href value provided to trigger the `highligh` event is not readable, received:', href);
      } else {
        onHighlight({
          idx: matchIndices[1].split(',')
        });
      }
    }
  }

  return (
    <div onClick={handleClick}>
      <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
    </div>
  )
}

export default ArticleCellTextObject
