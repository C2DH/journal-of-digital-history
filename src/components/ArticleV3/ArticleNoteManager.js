import React, { useRef, useEffect } from 'react'
import { useArticleStore } from '../../store'
import Cite from 'citation-js'
import { a, useSpring } from '@react-spring/web'
import './ArticleNoteManager.css'
import { XmarkCircleSolid } from 'iconoir-react'

const ArticleNoteManager = ({ bibliography = {} }) => {
  const refId = useArticleStore((state) => state.selectedDataHref)
  const setSelectedDataHref = useArticleStore((state) => state.setSelectedDataHref)
  const contentRef = useRef(null)
  const bufferRef = useRef(null)
  const [styles, api] = useSpring(() => ({
    height: 0,
    opacity: 0,
  }))

  useEffect(() => {
    if (!refId) {
      console.info('[ArticleNoteManager] close note.')
      api.start({
        height: 0,
        opacity: 0,
      })
      return
    }

    const citation = bibliography.data?.find((d) => d.id === refId)

    const citationInstance = new Cite(citation)
    const noteAsHtml = citationInstance
      .format('bibliography', {
        template: 'apa',
        format: 'html',
      })
      .replace(
        /(https?:\/\/[0-9a-zA-Z-./_:?=]+)([^0-9a-zA-Z-./]+)/g,
        (m, link, r) => `<a href="${link}" target="_blank">${link}</a>${r}`,
      )

    console.info(
      'ArticleNoteManager selectedDataHref:',
      refId,
      bibliography,
      citation,
      citationInstance,
    )

    bufferRef.current.innerHTML = noteAsHtml
    console.info('EOIROEIROEIORIE', bufferRef.current.scrollHeight)
    contentRef.current.innerHTML = noteAsHtml

    api.start({
      height: bufferRef.current.scrollHeight,
      opacity: 1,
    })
  }, [refId, bibliography])

  return (
    <div className="ArticleNoteManager">
      <a.div className="container" style={{ opacity: styles.opacity }}>
        <div className="row ">
          <div className="col col-lg-8 col-md-8 offset-lg-2 offset-md-1 position-relative">
            <div className="ArticleNoteManager__buffer" ref={bufferRef}></div>
            <a.div className="ArticleNoteManager__contentWrapper" style={{ height: styles.height }}>
              <div className="ArticleNoteManager__content" ref={contentRef}></div>
              <div className="ArticleNoteManager__close">
                <button
                  className="btn btn-sm btn-transparent text-white"
                  onClick={() => setSelectedDataHref(null)}
                >
                  <XmarkCircleSolid height={24} width={24} />
                </button>
              </div>
            </a.div>
          </div>
        </div>
      </a.div>
    </div>
  )
}

export default ArticleNoteManager
