import React from 'react'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'


const ArticleCellFigure = ({ figure, outputs=[] }) => {
  const captions = outputs.reduce((acc, output) => {
    if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
      acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
    }
    return acc
  }, [])

  return (
    <div className="ArticleCellFigure">
      <div className="anchor" id={figure.ref} />
    {!outputs.length ? (
      <div className="ArticleCellFigure_no_output">
      no output
      </div>
    ): null}
    {outputs.map((output,i) => (
      <ArticleCellOutput hideLabel output={output} key={i} />
    ))}
    <ArticleFigure figure={figure}><p dangerouslySetInnerHTML={{
      __html: captions.join('<br />'),
    }} /></ArticleFigure>
    </div>
  )
}

export default ArticleCellFigure
