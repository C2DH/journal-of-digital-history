import React from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayLayerHermeneutics, DisplayLayerNarrative } from '../constants'
import { useArticleStore } from '../store'
import '../styles/components/SwitchLayer.scss'


const SwitchLayer = ({ disabled, className, binderUrl }) => {
  const { t } = useTranslation()
  const [displayLayer, setDisplayLayer] = useArticleStore(state => [state.displayLayer, state.setDisplayLayer])
  if (disabled) {
    return null
  }

  return (
    <ul className={`SwitchLayer ${className}`} style={{pointerEvents: 'auto'}}>
      {[DisplayLayerNarrative, DisplayLayerHermeneutics].map(d => (
        <li key={d} className={displayLayer === d ? 'active': ''}
          onClick={() => setDisplayLayer(d)}>{t(`layers.${d}`)}</li>
      ))}
      { binderUrl
        ? (
          <li>
            <a target="_blank"  rel="noreferrer" href={binderUrl}>
              <img src="https://mybinder.org/static/images/badge_logo.svg?v=29bb88d0f5fe83fa7241a8bd5ab75c3abc719ea2ac9591b5448801ff197d0bba86db86dac02ae6150f36eb9dd433ec4496fc1cc36181187057e169a51d82f21d"/>
            </a>
          </li>
        ): null
      }
    </ul>
  )
}

export default SwitchLayer
