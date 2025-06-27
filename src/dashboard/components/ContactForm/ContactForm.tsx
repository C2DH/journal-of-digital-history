import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import './ContactForm.css'

const ContactForm = ({ contactEmail, action }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    from: 'jdh.admin@uni.lu',
    to: '',
  })

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      to: contactEmail || '',
    }))
  }, [contactEmail])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // TODO
    // integrate backend call here to change status + send email
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
        <input
          name="subject"
          value={t(`email.${action}.subject`)}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          value={t(`email.${action}.message`)}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Send</button>
    </form>
  )
}

export default ContactForm
