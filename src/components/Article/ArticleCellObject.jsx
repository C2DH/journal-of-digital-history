import React, { useMemo, lazy } from 'react'
import { markdownParser } from '../../logic/ipynb'
import ArticleFigureCaption from './ArticleFigureCaption'

const VegaWrapper = lazy(() => import('../Module/VegaWrapper'))
const ImageWrapper = lazy(() => import('../Module/ImageWrapper'))

const ArticleCellObject = ({ metadata, figure, children, progress }) => {
  const objectMetadata = useMemo(() => metadata.jdh?.object ?? {}, [metadata.jdh])
  const objectOutputs = useMemo(() => metadata.jdh?.outputs ?? [], [metadata.jdh])
  const objectContents = useMemo(() => {
    if (Array.isArray(objectMetadata.source)) {
      return markdownParser.render(objectMetadata.source.join('\n'))
    }
    return null
  }, [objectMetadata])
  const objectClassName = Array.isArray(objectMetadata.cssClassName)
    ? objectMetadata.cssClassName
    : []
  let objectWrapperStyle = {
    backgroundColor: objectMetadata.background?.color,
    border: objectMetadata.border,
    width: '100%',
    // h is necessary to calculate bounding box correctly.
    // override with HeightRatio
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
  // flex alignment
  if (
    ['start', 'flex-start', 'end', 'flex-end', 'center', 'space-between', 'space-around'].includes(
      objectMetadata.justifyContent,
    )
  ) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      justifyContent: objectMetadata.justifyContent,
    }
  }
  if (
    ['start', 'flex-start', 'end', 'flex-end', 'center', 'baseline', 'first baseline'].includes(
      objectMetadata.alignItems,
    )
  ) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      alignItems: objectMetadata.alignItems,
    }
  }

  if (!isNaN(objectMetadata.heightRatio)) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      height: window.innerHeight * objectMetadata.heightRatio,
    }
  }

  if (objectMetadata.position === 'sticky') {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      position: 'sticky',
      top: objectMetadata.top ?? 'var(--spacer-3)',
    }
    if (isNaN(objectMetadata.heightRatio)) {
      objectWrapperStyle.height = 'auto'
    }
  }

  return (
    <>
      <div style={objectWrapperStyle} className={objectClassName.join(' ')}>
        {objectMetadata.type === 'image' &&
          objectOutputs.map((output, i) => (
            <ImageWrapper key={i} metadata={objectMetadata} output={output} figure={figure} />
          ))}
        {['video', 'map'].includes(objectMetadata.type) && (
          <>
            {progress}
            <div dangerouslySetInnerHTML={{ __html: objectContents }}></div>
          </>
        )}
        {['vega'].includes(objectMetadata.type) ? (
          <VegaWrapper metadata={objectMetadata} progress={progress}>
            <ArticleFigureCaption figure={figure}>
              <div dangerouslySetInnerHTML={{ __html: objectContents }}></div>
            </ArticleFigureCaption>
          </VegaWrapper>
        ) : null}
        {['text'].includes(objectMetadata.type) && (
          <div dangerouslySetInnerHTML={{ __html: objectContents }}></div>
        )}
      </div>
      <div>{children}</div>
    </>
  )
}

export default ArticleCellObject
