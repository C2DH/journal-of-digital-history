import React, { useState, useEffect } from 'react'
import { FormFieldProps } from './interface'

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  type = 'text',
  onChange,
  error,
  reset,
}) => {
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (reset) {
      setTouched(false);
    }
  }, [reset]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!touched) {
      setTouched(true)
    }
    onChange(event)
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={`form-control ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={handleChange}
        ></textarea>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          className={`form-check-input ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          checked={Boolean(value)}
          onChange={handleChange}
        />
      ) : (
        <input
          type={type}
          className={`form-control ${touched ? (error ? 'is-invalid' : 'is-valid') : ''}`}
          id={id}
          value={String(value)}
          onChange={handleChange}
        />
      )}
      {touched && error && <div className="text-muted form-text">{error}</div>}
    </div>
  )
}

export default FormField
