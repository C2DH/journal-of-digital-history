import React from 'react'
import { Circle, FlashSolid, XmarkCircleSolid } from 'iconoir-react'
import PropTypes from 'prop-types'
import ButtonInflatable from '../ButtonInflatable'
import CircularLoading from '../CircularLoading'
import './ArticleThebeSessionButton.css'

export const StatusIdle = 'idle'
export const StatusPreparing = 'preparing'
export const StatusReady = 'ready'
export const StatusRestarting = 'restarting'

export const StatusIcons = {
  [StatusIdle]: Circle,
  [StatusPreparing]: XmarkCircleSolid,
  [StatusReady]: FlashSolid,
  [StatusRestarting]: Circle,
}

const StatusLabels = {
  [StatusIdle]: '(idle))',
  [StatusPreparing]: 'Preparing …',
  [StatusReady]: 'Ready',
  [StatusRestarting]: 'Restarting …',
}
export const AvailableStatuses = [StatusIdle, StatusPreparing, StatusReady, StatusRestarting]

const ArticleThebeSessionButton = ({
  disabled,
  kernelName = 'no kernel',
  status,
  debug = false,
  onClick,
}) => {
  const Component = StatusIcons[status]
  const label = StatusLabels[status] + ' ' + kernelName
  return (
    <div className={`ArticleThebeSessionButton ${status} d-flex align-items-center`}>
      <ButtonInflatable
        title={label}
        label={label}
        onClick={onClick}
        disabled={disabled}
        className="btn btn-sm btn-transparent d-flex align-items-center"
      >
        <div className="ArticleThebeSessionButton__iconWrapper me-2">
          <Component height={16} width={16} />
          <CircularLoading width={23} height={23} />
        </div>
      </ButtonInflatable>

      {debug && <div className="ms-2 ArticleThebeSessionButton__status">{status}</div>}
    </div>
  )
}

ArticleThebeSessionButton.propTypes = {
  status: PropTypes.string,
  kernelName: PropTypes.string,
  disabled: PropTypes.bool,
  debug: PropTypes.bool,
  onClick: PropTypes.func,
}

export default ArticleThebeSessionButton
