import React from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayLayerHermeneutics, DisplayLayerNarrative } from '../constants'
import { useArticleStore } from '../store'
import '../styles/components/SwitchLayer.scss'


const SwitchLayer = ({ disabled }) => {
  const { t } = useTranslation()
  const [displayLayer, setDisplayLayer] = useArticleStore(state => [state.displayLayer, state.setDisplayLayer])
  if (disabled) {
    return null
  }

  return (
    <ul className="SwitchLayer" style={{pointerEvents: 'auto'}}>
      {[DisplayLayerNarrative, DisplayLayerHermeneutics].map(d => (
        <li key={d} className={displayLayer === d ? 'active': ''}
          onClick={() => setDisplayLayer(d)}>{t(`layers.${d}`)}</li>
      ))}
    </ul>
  )
}

export default SwitchLayer
