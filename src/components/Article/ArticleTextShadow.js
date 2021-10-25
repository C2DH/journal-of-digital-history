import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { ArrowLeft } from 'react-feather'
import { useSpring, a, config } from 'react-spring'
import { setBodyNoScroll } from '../../logic/viewport'
import { useArticleStore } from '../../store'
import { DisplayLayerHermeneutics, DisplayLayerNarrative } from '../../constants'
import ArticleHeader from './ArticleHeader'

const layerTransition = (x, y, width, height) => {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleTextShadow = ({
  width, height,
  // memoid='',
  title,
  issue,
  publicationDate,
  publicationStatus,
  doi,
  children
}) => {
  const [displayLayer, setDisplayLayer] = useArticleStore(state => [state.displayLayer, state.setDisplayLayer])
  const [props, setProps] = useSpring(() => ({ clipPath: [width, 50, width, height], x:0, y:0, config: config.slow }))//, config: { mass: 1, tension: 50, friction: 10 } }))

  useEffect(() => {
    if (displayLayer === DisplayLayerHermeneutics) {
      setBodyNoScroll(true)
      setProps.start({ clipPath: [0, 0, width, height], x:-width, y:0 })
    } else {
      setBodyNoScroll(false)
      setProps.start({ clipPath: [width, 50, width, height], x:0, y:0 })
    }
  }, [displayLayer, width, height])
  // remove on exit
  useEffect(() => () => {
    setBodyNoScroll(false)
    setDisplayLayer(DisplayLayerNarrative)
  }, [])

  return (
    <a.div className="ArticleTextShadow bg-hermeneutics" style={{
      width,
      height,
      clipPath: props.clipPath.interpolate(layerTransition),
    }}>
      <div className="ArticleTextShadow_mask bg-hermeneutics"></div>
      <div className="page mt-5">
      <ArticleHeader
        doi={doi}
        issue={issue}
        publicationDate={publicationDate}
        title={title}
        publicationStatus={publicationStatus}
      >
        <div className="jumbotron border border-dark p-3 my-3 shadow bg-hermeneutics rounded">
        <h3>Hermeneutic-first version</h3>
        <p>A brief explaination of what the hermeneutic view is.</p>
        <Button variant="outline-secondary" size="sm" onClick={() => setDisplayLayer(DisplayLayerNarrative)}>
          <ArrowLeft size={15}/> back to narrative-first mode
        </Button>
        </div>
      </ArticleHeader>
      {children}
      </div>
    </a.div>
  )
}

export default ArticleTextShadow
