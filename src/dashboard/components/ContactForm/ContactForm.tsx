import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContactFormData } from './interface'

import { contactFormSchema } from '../../schemas/contactForm'
import { modifyAbstractStatus } from '../../utils/helpers/postData'

import './ContactForm.css'

function validateContactForm(data: any) {
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(contactFormSchema)
  const valid = validate(data)

  return { valid, errors: validate.errors }
}

const ContactForm = ({ contactEmail, pid, action, title }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    pid: '',
    from: 'jdh.admin@uni.lu',
    to: '',
    subject: '',
    message: t(`email.${action}.message`),
    status: '',
  })
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      pid: pid || '',
      to: contactEmail || '',
      status: action || '',
      subject: title || '',
    }))
  }, [contactEmail, pid, title])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data: ContactFormData = {
      from: form.from,
      to: form.to,
      subject: form.subject,
      body: form.message,
      status: form.status,
    }
    console.info('[ContactForm] Data:', data)

    const { valid, errors } = validateContactForm(data)

    if (valid) {
      try {
        const res = await modifyAbstractStatus(form.pid, data)
        setNotification({
          type: 'success',
          message: res?.data?.message || 'Message sent successfully!',
        })
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
        <input name="from" value={form.from} onChange={handleChange} required />
      </label>
      <label>
        To
        <input name="to" value={form.to} onChange={handleChange} required />
      </label>
      <label>
        Subject
        <input name="subject" value={form.subject} onChange={handleChange} required />
      </label>
      <label>
        Message
        <textarea name="message" value={form.message} onChange={handleChange} required />
      </label>
      {notification && (
        <div
          className={`notification notification-${notification.type}`}
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            background: notification.type === 'success' ? '#e6ffed' : '#ffe6e6',
            color: notification.type === 'success' ? '#207245' : '#a94442',
            border: `1px solid ${notification.type === 'success' ? '#b7ebc6' : '#f5c6cb'}`,
          }}
        >
          {notification.message}
        </div>
      )}
      <button type="submit">Send</button>
    </form>
  )
}

export default ContactForm
