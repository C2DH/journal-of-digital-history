import React from 'react'
import { FormFieldProps } from './interface'

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  type = 'text',
  onChange,
  error,
}) => {
  console.log("🚀 ~ file: StaticForm.tsx:11 ~ error:", error)
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" id={id} value={value} onChange={onChange}></textarea>
      ) : (
        <input type={type} className="form-control" id={id} value={value} onChange={onChange} />
      )}
      {error && <div className="text-muted form-text">{error}</div>}
    </div>
  )
}

export default FormField
