import './tooltip.css'

import { InfoCircle } from 'iconoir-react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { CustomTooltipProps } from './interface'

import Help from '../../assets/icons/Help'

const CustomTooltip = ({
  text,
  tooltipPlacement = 'right',
  fieldname,
  icon = 'help',
  index,
}: CustomTooltipProps) => {
  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      overlay={
        <Tooltip id={`tooltip-${fieldname}-${index}`} className="custom-tooltip">
          {`${text}`}
        </Tooltip>
      }
    >
      {icon === 'info' ? <InfoCircle /> : <Help className="help-icon" />}
    </OverlayTrigger>
  )
}

export default CustomTooltip
