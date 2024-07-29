import React, { useRef } from 'react'
import axios from 'axios'
import ArticleCellExplainCodeButton, {
  StatusIdle,
  StatusSuccess,
  StatusExecuting,
  StatusError,
} from './ArticleCellExplainCodeButton'
import { a, useSpring } from '@react-spring/web'
import './ArticleCellExplainer.css'

import { useArticleCellExplainerStore } from '../../store'
import { useMutation } from '@tanstack/react-query'

const ArticleCellExplainer = ({ source = '', cellIdx = '', className = '' }) => {
  const messagesRef = useRef(null)
  const resultRef = useRef(null)
  const [styles, api] = useSpring(() => ({
    height: 0,
  }))
  const [free, lock] = useArticleCellExplainerStore((state) => [state.free, state.lock])
  const currentCellIdx = useArticleCellExplainerStore((state) => state.cellIdx)

  const { status, mutate, data, error } = useMutation({
    mutationFn: (code) => {
      console.info('[ArticleCellExplainer] mutationFn', code)
      return axios
        .post('/api/explain', {
          code,
        })
        .catch((error) => {
          console.error('[ArticleCellExplainer] mutationFn error', error)
          api.start({
            height: messagesRef.current.scrollHeight,
          })
          free()
          throw error
        })
    },
    onSuccess: (res) => {
      console.info('[ArticleCellExplainer] mutation success', res)
      resultRef.current.innerHTML = JSON.stringify(res.data.result, null, 2)
      api.start({
        height: messagesRef.current.scrollHeight,
      })
      free()
    },
  })

  const onExplainCodeClickHandler = () => {
    console.debug('[ArticleCellExplainer] @onClick ', messagesRef.current.scrollHeight)
    lock(cellIdx)
    let codeToExplain = Array.isArray(source) ? source.join('\n') : source
    // reduce the code To Explain Length to max 500 chars
    if (codeToExplain.length > 1000) {
      codeToExplain = codeToExplain.slice(0, 1000)
      console.debug('[ArticleCellExplainer] codeToExplain shortened to 1000 chars')
    }
    mutate(codeToExplain)
  }

  const onCloseClickHandler = () => {
    free()
    api.start({
      height: 0,
    })
  }
  // display Status
  let displayStatus = StatusIdle
  if (status === 'success') {
    displayStatus = StatusSuccess
  } else if (status === 'loading') {
    displayStatus = StatusExecuting
  } else if (status === 'error') {
    displayStatus = StatusError
  }
  const disabled = currentCellIdx !== null
  const cellSource = Array.isArray(source) ? source.join('\n') : source
  return (
    <div className={`ArticleCellExplainer ${className}`}>
      <div className="d-flex">
        <ArticleCellExplainCodeButton
          status={displayStatus}
          disabled={disabled}
          onClick={onExplainCodeClickHandler}
        />
        <a.button
          style={{ opacity: styles.opacity }}
          onClick={onCloseClickHandler}
          className="btn btn-transparent btn-pill btn-sm text-white ms-2"
        >
          (close)
        </a.button>
      </div>
      <a.section ref={messagesRef} className="px-2" style={styles}>
        <div ref={resultRef}></div>
        axios: {status}
        <pre>{JSON.stringify({ data, error })}</pre>
        <h3>Explainer</h3>
        {cellSource.length} characters
        <pre>{cellSource}</pre>
        <p>
          This code cell is an explainer cell. It is used to provide context and explanation for the
          code cell above it.
        </p>
        <p>
          You can edit the content of this cell by clicking the pencil icon in the top right corner.
        </p>
      </a.section>
    </div>
  )
}

export default ArticleCellExplainer
