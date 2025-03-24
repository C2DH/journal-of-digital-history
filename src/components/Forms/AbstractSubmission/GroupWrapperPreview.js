import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


const FormGroupWrapperPreview = ({
  label, children,
}= {}) => {
  const { t } = useTranslation()

  return(
    <Form.Group>
      {label && (<Form.Label>{t(label)}</Form.Label>)}
      <div className="p-2" style={{
        backgroundColor: 'var(--gray-300)'
      }}>{children}</div>
    </Form.Group>
  )
}

export default FormGroupWrapperPreview
