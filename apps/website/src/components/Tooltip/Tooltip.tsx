
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { CustomTooltipProps} from '../../interfaces/tooltip'

const CustomTooltip= ({
  tooltip,
  tooltipPlacement = 'right',
  fieldname,
  index,
} : CustomTooltipProps ) => {
  const { t } = useTranslation()

  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      overlay={
        <Tooltip id={`tooltip-${fieldname}-${index}`} className="custom-tooltip">
          {t(`${tooltip}`)}
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