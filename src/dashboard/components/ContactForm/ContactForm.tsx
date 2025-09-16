import './ContactForm.css'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { contactFormSchema } from '../../schemas/contactForm'
import { useFormStore } from '../../store'
import { modifyAbstractStatusWithEmail } from '../../utils/api/api'
import Button from '../Buttons/Button/Button'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'

function validateForm(data: any) {
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(contactFormSchema)
  const valid = validate(data)

  return { valid, errors: validate.errors }
}

function formatMessage(template, data) {
  return template
    .replace(/\{recipientName\}/g, data?.row[4] + ' ' + data?.row[5] || 'author')
    .replace(/\{submissionTitle\}/g, data?.title)
    .replace(/\{submissionId\}/g, data?.id)
    .replace(/\{contactEmail\}/g, 'jdh.admin@uni.lu')
    .replace(/\{signature\}/g, 'JDH Team')
}

const ContactForm = ({ rowData, action, onClose, onNotify }) => {
  const { t } = useTranslation()
  const { isModalOpen, openModal, closeModal, setFormData, formData } = useFormStore()

  useEffect(() => {
    setFormData({
      pid: rowData.id || '',
      from: 'jdh.admin@uni.lu',
      to: rowData.contactEmail || '',
      subject: rowData.title || '',
      body: formatMessage(parse(t(`email.${action}.body`)), rowData),
      status: action || '',
    })
  }, [rowData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...(formData || {}),
      [name]: value,
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    openModal()
  }

  const handleConfirmSubmit = async () => {
    const { valid, errors } = validateForm(formData)

    if (valid) {
      try {
        const res = await modifyAbstractStatusWithEmail(formData?.pid, formData)
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'success',
            message: t('email.success.api.contactForm'),
            submessage: res?.data?.message || '',
          })
      } catch (err: any) {
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'error',
            message: t('email.error.api.message'),
            submessage: err?.response?.data?.message,
          })
      } finally {
        closeModal()
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
    <form className="contact-form" onSubmit={handleFormSubmit}>
      <label>
        From
        <input name="from" value={formData?.from || ''} onChange={handleChange} required />
      </label>
      <label>
        To
        <input name="to" value={formData?.to || ''} onChange={handleChange} required />
      </label>
      <label>
        Subject
        <input name="subject" value={formData?.subject || ''} onChange={handleChange} required />
      </label>
      <label>
        Body
        <textarea
          name="body"
          value={String(formData?.body) || ''}
          onChange={handleChange}
          required
        />
      </label>
      <Button type="submit" text={t('contactForm.send', 'Send')} />
      <ConfirmationModal
        isOpen={isModalOpen}
        message={t(`email.confirmation.${action}`)}
        onConfirm={handleConfirmSubmit}
        onCancel={closeModal}
      />
    </form>
  )
}

export default ContactForm
