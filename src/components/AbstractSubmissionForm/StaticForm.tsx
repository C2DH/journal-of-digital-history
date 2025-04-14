import React, { useState, useEffect } from 'react'
import { FormFieldProps, InputChangeHandler } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'

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
          onChange={handleChange}
          placeholder={placeholder}
          rows={5}
        ></textarea>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          className={`form-check-input ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          checked={Boolean(value)}
          onChange={handleChange}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          className={`form-select ${missing ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          value={String(value)}
          onChange={handleChange}
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
        />
      )}
      {missing && error && (
        <div className="text-error form-text">
          {t(`pages.abstractSubmission.errors.${id}.${error}`)}
        </div>
      )}
    </div>
  )
}

export default FormField
