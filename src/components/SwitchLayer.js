import React from 'react'
import { DisplayLayerHermeneutics } from '../constants'
import { useArticleStore } from '../store'
import '../styles/components/SwitchLayer.scss'

const SwitchLayer = ({ disabled }) => {
  const [displayLayer, setDisplayLayer] = useArticleStore(state => [state.displayLayer, state.setDisplayLayer])
  if (disabled) {
    return null
  }

  return (
    <ul className="SwitchLayer" style={{pointerEvents: 'auto'}}>
      <li className={!displayLayer ? "active":""}
        onClick={() => setDisplayLayer(null)}>Narrative</li>
      <li className={displayLayer === DisplayLayerHermeneutics?"active":""}
        onClick={() => setDisplayLayer(DisplayLayerHermeneutics)}>Hermeneutics</li>
    </ul>
  )
}

export default SwitchLayer
