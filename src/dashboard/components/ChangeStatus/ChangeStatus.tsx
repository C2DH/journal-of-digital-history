import './ChangeStatus.css'

import Ajv from 'ajv'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChangeStatusProps } from './interface'

import { changeStatusSchema } from '../../schemas/changeStatus'
import { abstractStatus } from '../../utils/constants/abstracts'
import { modifyAbstractsStatus } from '../../utils/helpers/postData'
import Button from '../Buttons/Button/Button'

function validateChangeStatusForm(data: any) {
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(changeStatusSchema)
  const valid = validate(data)

  return { valid, errors: validate.errors }
}

const ChangeStatus = ({ item, selectedRows, onClose, onNotify }: ChangeStatusProps) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('')

  const handleSubmitStatus = async (e) => {
    e.preventDefault()
    const data = {
      pids: selectedRows.map((row) => row.pid),
      status: status,
    }
    const { valid, errors } = validateChangeStatusForm(data)

    if (valid) {
      try {
        const res = await modifyAbstractsStatus(data)
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'success',
            message: 'You have changed statuses for all these abstracts !',
            submessage: res?.data?.message || '',
          })
      } catch (err: any) {
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'error',
            message: 'Something really bad happened...',
            submessage: err?.response?.data?.details,
          })
      }
    }
    if (!valid) {
      onNotify({
        type: 'error',
        message: t('email.error.validation.message'),
        submessage: t('email.error.validation.submessage'),
      })
      console.error(errors)
      return
    }
  }

  return (
    <form className="change-status-container" onSubmit={handleSubmitStatus}>
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
        <div className="status-actions">
          <Button type="submit" text={t('contactForm.send', 'Send')} />
          <Button
            type="button"
            color="color-deep-blue"
            text={t('contactForm.cancel', 'Cancel')}
            onClick={onClose}
          />
        </div>
      </div>
    </form>
  )
}

export default ChangeStatus
