import { a, useSpring } from '@react-spring/web'
import axios from 'axios'
import { useRef } from 'react'
import { markdownParser } from '../../logic/markdown'
import ArticleCellExplainCodeButton, {
  StatusError,
  StatusExecuting,
  StatusIdle,
  StatusSuccess,
} from './ArticleCellExplainCodeButton'
import './ArticleCellExplainer.css'

import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useArticleCellExplainerStore } from '../../store'

console.info(
  '%cEnable Code Explainer',
  'font-weight: bold',
  import.meta.env.VITE_ENABLE_CODE_EXPLAINER === 'true',
)

const ArticleCellExplainer = ({ source = '', cellIdx = '', className = '' }) => {
  const { t } = useTranslation()
  const messagesRef = useRef(null)
  const resultRef = useRef(null)
  const [styles, api] = useSpring(() => ({
    height: 0,
    opacity: 0,
  }))
  const [free, lock] = useArticleCellExplainerStore((state) => [state.free, state.lock])
  const currentCellIdx = useArticleCellExplainerStore((state) => state.cellIdx)

  const { status, mutate } = useMutation({
    mutationFn: (code) => {
      console.info('[ArticleCellExplainer] mutationFn n.chars:', code.length)
      return axios.post('/api/explain', {
        code,
      })
    },
    onSuccess: (res) => {
      console.info('[ArticleCellExplainer] mutation success', res)
      const messages = res.data.result.choices.map((choice) => choice.content).join('<br/>')
      resultRef.current.innerHTML = markdownParser.render(messages)
      api.start({
        height: messagesRef.current.scrollHeight,
        opacity: 1,
      })
      free()
      return res
    },
    onError: (error) => {
      console.error('[ArticleCellExplainer] mutation error', error)
      resultRef.current.innerHTML = t('errors.explainCodeNotAvailable', {
        error: error.message,
      })
      api.start({
        height: messagesRef.current.scrollHeight,
        opacity: 1,
      })
      free()
    },
  })

  const onExplainCodeClickHandler = () => {
    console.debug('[ArticleCellExplainer] @onClick ', messagesRef.current.scrollHeight)
    lock(cellIdx)
    let codeToExplain = Array.isArray(source) ? source.join('\n') : source
    // reduce the code To Explain Length to max 500 chars
    codeToExplain = codeToExplain.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')
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
      opacity: 0,
    })
  }
  // display Status
  let displayStatus = StatusIdle
  if (status === 'success') {
    displayStatus = StatusSuccess
  } else if (status === 'pending') {
    displayStatus = StatusExecuting
  } else if (status === 'error') {
    displayStatus = StatusError
  }
  const disabled = currentCellIdx !== null
  // const cellSource = Array.isArray(source) ? source.join('\n') : source
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
      <a.section ref={messagesRef} style={{ height: styles.height }}>
        <div
          className={`ArticleCellExplainer__messages ${
            displayStatus === StatusError ? 'error' : ''
          }`}
          data-cy={`ArticleCellExplainer-messages ${displayStatus === StatusError ? 'error' : ''}`}
          ref={resultRef}
        ></div>
      </a.section>
    </div>
  )
}

export default ArticleCellExplainer
