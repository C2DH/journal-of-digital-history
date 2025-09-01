import './tooltip.css'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { CustomTooltipProps } from './interface'

import Help from '../../assets/icons/Help'

const CustomTooltip = ({
  tooltip,
  tooltipPlacement = 'right',
  fieldname,
  index,
}: CustomTooltipProps) => {
  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      overlay={
        <Tooltip id={`tooltip-${fieldname}-${index}`} className="custom-tooltip">
          {`${tooltip}`}
        </Tooltip>
      }
    >
      <Help className="help-icon" />
    </OverlayTrigger>
  )
}

export default CustomTooltip
