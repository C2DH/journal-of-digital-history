import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { CustomTooltipProps } from './interface'

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
      <span className="material-symbols-outlined ms-2" style={{ cursor: 'pointer' }}>
        help
      </span>
    </OverlayTrigger>
  )
}

export default CustomTooltip
