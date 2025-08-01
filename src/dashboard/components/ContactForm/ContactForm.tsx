import './ContactForm.css'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactFormData } from './interface'

import { contactFormSchema } from '../../schemas/contactForm'
import { modifyAbstractStatus } from '../../utils/helpers/postData'

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

const ContactForm = ({ data, action }) => {
  const { t } = useTranslation()
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [form, setForm] = useState<ContactFormData | null>(null)

  useEffect(() => {
    if (!data) return

    setForm({
      pid: data.pid || '',
      from: 'jdh.admin@uni.lu',
      to: data.contactEmail || '',
      subject: data.title || '',
      message: formatMessage(parse(t(`email.${action}.message`)), data),
      status: action || '',
    })
  }, [data, action, t])

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
      message: String(form?.message),
      status: form?.status,
    }
    console.info('[ContactForm] Data:', data)

    const { valid, errors } = validateContactForm(data)

    if (valid) {
      try {
        const res = await modifyAbstractStatus(String(form?.pid), data)
        setNotification({
          type: 'success',
          message: res?.data?.message || 'Message sent successfully!',
        })
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } catch (err: any) {
        setNotification({
          type: 'error',
          message: err?.response?.data?.message || 'An error occurred.',
        })
      }
    }
    if (!valid) {
      setNotification({ type: 'error', message: 'Validation failed. Please check your input.' })
      console.error(errors)
      return
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        From
        <input name="from" value={form?.from} onChange={handleChange} required />
      </label>
      <label>
        To
        <input name="to" value={form?.to} onChange={handleChange} required />
      </label>
      <label>
        Subject
        <input name="subject" value={form?.subject} onChange={handleChange} required />
      </label>
      <label>
        Message
        <textarea name="message" value={String(form?.message)} onChange={handleChange} required />
      </label>
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      <button type="submit">Send</button>
    </form>
  )
}

export default ContactForm
