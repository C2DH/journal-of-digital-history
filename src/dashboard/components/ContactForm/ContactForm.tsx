import './ContactForm.css'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactFormData } from './interface'

import { contactFormSchema } from '../../schemas/contactForm'
import { modifyAbstractStatus } from '../../utils/helpers/postData'
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

const ContactForm = ({ data, action, onClose, onNotify }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<ContactFormData | null>(null)

  useEffect(() => {
    if (!data) return

    setForm({
      pid: data.id || '',
      from: 'jdh.admin@uni.lu',
      to: data.contactEmail || '',
      subject: data.title || '',
      body: formatMessage(parse(t(`email.${action}.body`)), data),
      status: action || '',
    })
  }, [data, action])

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
        const res = await modifyAbstractStatus(String(form?.pid), data)
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'success',
            message: res?.data?.message || 'Message sent successfully!',
          })
      } catch (err: any) {
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'error',
            message: err?.response?.data?.message || 'An error occurred.',
          })
      }
    }
    if (!valid) {
      onNotify({
        type: 'error',
        message: 'Validation failed.',
        submessage: 'Please check your input.',
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
        <textarea
          name="message"
          value={String(form?.body) || ''}
          onChange={handleChange}
          required
        />
      </label>
      <Button type="submit" text={t('contactForm.send', 'Send')} />
    </form>
  )
}

export default ContactForm
