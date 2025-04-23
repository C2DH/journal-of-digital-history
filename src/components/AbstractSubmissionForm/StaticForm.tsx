import React, { useState, useEffect } from 'react'
import { FormFieldProps, InputChangeHandler } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'

import { submissionFormSchema as schema } from '../../schemas/abstractSubmission'

const FormField = ({
  id,
  label,
  placeholder,
  required,
  value,
  type = 'text',
  options = [],
  onChange,
  error,
  isMissing,
}: FormFieldProps) => {
  const { t } = useTranslation()
  const [missing, setIsMissing] = useState(false)

  useEffect(() => {
    if (isMissing) {
      setIsMissing(true)
    }
  }, [isMissing])

  const handleChange: InputChangeHandler = (event) => {
    if (!missing) {
      setIsMissing(true)
    }
    onChange(event)
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className={`form-control ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={(value) => {
            handleChange(value)
          }}
          placeholder={placeholder}
          rows={5}
          data-test={`form-textarea-${id}`}
        ></textarea>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          className={`form-check-input ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          checked={Boolean(value)}
          onChange={handleChange}
          data-test={`form-checkbox-${id}`}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          className={`form-select ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          value={String(value)}
          onChange={handleChange}
          data-test={`form-select-${id}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`form-control ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={handleChange}
          placeholder={placeholder}
          data-test={`form-control-${id}`}
        />
      )}
      <div className="d-flex justify-content-between mt-1">
        {missing && error && (
          <div className="text-error form-text" data-test={`error-message-${id}`}>
            {t(`pages.abstractSubmission.errors.${id}.${error}`)}
          </div>
        )}
        {type === 'textarea' && (
          <div className="text-muted ms-auto">
            {String(value) ? `${String(value).length} / ${schema.properties[id].maxLength}` : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormField
