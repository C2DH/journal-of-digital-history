import './ChangeStatus.css'

import Ajv from 'ajv'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChangeStatusProps } from './interface'

import { abstractStatusSchema, articleStatusSchema } from '../../schemas/changeStatus'
import { abstractStatus } from '../../utils/constants/abstract'
import { articleStatus } from '../../utils/constants/article'
import { modifyStatus } from '../../utils/helpers/api'
import Button from '../Buttons/Button/Button'

function validateChangeStatusForm(data: any, item: string) {
  const schema = item === 'abstracts' ? abstractStatusSchema : articleStatusSchema
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema)
  const valid = validate(data)

  return { valid, errors: validate.errors }
}

const ChangeStatus = ({ item, selectedRows, onClose, onNotify }: ChangeStatusProps) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('')

  const itemStatus = item === 'abstract' ? abstractStatus : articleStatus

  const handleSubmitStatus = async (e) => {
    e.preventDefault()
    const data = {
      pids: selectedRows.map((row) => row.pid),
      status: status,
    }
    const { valid, errors } = validateChangeStatusForm(data, item)

    if (valid) {
      try {
        const res = await modifyStatus(data, item)
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'success',
            message: t(`email.error.api.bulkStatus.${item}`),
            submessage: res?.data?.message || '',
          })
      } catch (err: any) {
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'error',
            message: t('email.error.api.message'),
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
          {itemStatus.map((opt) => (
            <option key={opt.value} value={opt.value.toLowerCase()}>
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
