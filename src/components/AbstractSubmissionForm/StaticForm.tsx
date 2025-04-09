import React, { useState, useEffect } from 'react'
import { FormFieldProps } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'

const FormField = ({
  id,
  label,
  required,
  value,
  type = 'text',
  options = [],
  onChange,
  error,
  reset,
  placeholder,
}: FormFieldProps) => {
  const { t } = useTranslation()
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (reset) {
      setTouched(false)
    }
  }, [reset])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (!touched) {
      setTouched(true)
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
          className={`form-control ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={handleChange}
          placeholder={placeholder}
          rows={5}
        ></textarea>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          className={`form-check-input ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          checked={Boolean(value)}
          onChange={handleChange}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          className={`form-select ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
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
          className={`form-control ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={handleChange}
          placeholder={placeholder}
        />
      )}
      {touched && error && (
        <div className="text-error form-text">
          {t(`pages.abstractSubmission.errors.${id}.${error}`)}
        </div>
      )}
    </div>
  )
}

export default FormField
