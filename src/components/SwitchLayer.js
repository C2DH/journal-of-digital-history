import React from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownButton, ButtonGroup, Dropdown} from 'react-bootstrap'
import { DisplayLayerHermeneutics, DisplayLayerAll } from '../constants'
import { useQueryParam, StringParam } from 'use-query-params'

const SwitchLayer = ({ style }) => {
  const { t } = useTranslation()
  const [layer, setLayer] = useQueryParam('layer', StringParam)

  return(
    <DropdownButton as={ButtonGroup}
      variant='outline-secondary'
      size="sm"
      title={t(`layers.${layer ?? 'default'}`)}
      style={{pointerEvents: 'auto', ...style}}
    >
      {[DisplayLayerHermeneutics, DisplayLayerAll, null].map((eventKey, i) => (
        <Dropdown.Item onClick={() => setLayer(eventKey)} key={i} eventKey={eventKey ?? -1 } active={layer === eventKey}>
          {t(`layers.${eventKey ?? 'default'}`)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
  // <button onClick={clickHandler} style={{position: 'fixed', top: 200, zIndex:1004}}>Change layer {layer}</button>

}

export default SwitchLayer
