import './ContactForm.css'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactFormData } from './interface'

import { contactFormSchema } from '../../schemas/contactForm'
import { modifyAbstractStatusWithEmail } from '../../utils/helpers/api'
import Button from '../Buttons/Button/Button'

function validateContactForm(data: any) {
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
  const [form, setForm] = useState<ContactFormData | null>(null)

  useEffect(() => {
    setForm({
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
    setForm((prevForm) => ({
      ...prevForm!,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data: ContactFormData = {
      from: String(form?.from),
      to: String(form?.to),
      subject: String(form?.subject),
      body: String(form?.body),
      status: form?.status,
    }
    const { valid, errors } = validateContactForm(data)

    if (valid) {
      try {
        const res = await modifyAbstractStatusWithEmail(String(form?.pid), data)
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
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        From
        <input name="from" value={form?.from || ''} onChange={handleChange} required />
      </label>
      <label>
        To
        <input name="to" value={form?.to || ''} onChange={handleChange} required />
      </label>
      <label>
        Subject
        <input name="subject" value={form?.subject || ''} onChange={handleChange} required />
      </label>
      <label>
        Body
        <textarea name="body" value={String(form?.body) || ''} onChange={handleChange} required />
      </label>
      <Button type="submit" text={t('contactForm.send', 'Send')} />
    </form>
  )
}

export default ContactForm
