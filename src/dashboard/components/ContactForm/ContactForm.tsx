import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      from: form.from,
      to: form.to,
      subject: form.subject,
      body: form.message,
      status: form.status,
    }
    console.info('[ContactForm] Data:', data)

    const { valid, errors } = validateContactForm(data)

    if (valid) {
      modifyAbstractStatus(form.pid, data)
    }
    if (!valid) {
      console.error(errors)
      return
    }
    // send data to backend
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
      <button type="submit">Send</button>
    </form>
  )
}

export default ContactForm
