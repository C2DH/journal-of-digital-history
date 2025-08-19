import './ChangeStatus.css'

import { useTranslation } from 'react-i18next'

import { ChangeStatusProps } from './interface'

import { abstractStatus } from '../../utils/constants/abstracts'
import api from '../../utils/helpers/setApiHeaders'
import Button from '../Buttons/Button/Button'

const ChangeStatus = ({ item, selectedRows, status, setStatus, onClose }: ChangeStatusProps) => {
  const { t } = useTranslation()
  const handleChangeStatus = (action: string, ids: string[]) => {
    api.patch(`/api/${item}/status/`, { ids, action })
  }

  return (
    <div className="change-status-container">
      <div className="ids-container">
        <span className="ids-container-label">Selection</span>
        <ul className="selected-list">
          {selectedRows.map((row) => (
            <li key={row.pid}>
              <span>{row.pid}</span>
              <strong>{row.title}</strong>
            </li>
          ))}
        </ul>
      </div>
      <div className="status-dropdown">
        <label className="status-dropdown-label" htmlFor="status-select">
          Select new status
        </label>
        <select
          name="status"
          id="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">-- Choose status --</option>
          {abstractStatus.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button type="submit" text={t('contactForm.send', 'Send')} />
        <Button type="button" text={t('contactForm.cancel', 'Cancel')} onClick={onClose} />
      </div>
    </div>
  )
}

export default ChangeStatus
