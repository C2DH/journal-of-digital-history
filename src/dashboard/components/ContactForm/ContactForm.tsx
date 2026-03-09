import './ContactForm.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { contactFormSchema } from '../../schemas/contactForm'
import { contactFormCopyEditingSchema } from '../../schemas/copyediting'
import { useFormStore } from '../../store'
import {
  modifyAbstractStatusWithEmail,
  patchArticleStatus,
  sendArticleToCopyeditor,
} from '../../utils/api/api'
import { validateForm } from '../../utils/helpers/checkSchema'
import Button from '../Buttons/Button/Button'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'

function formatMessage(template, data) {
  return template
    .replace(/\{recipientName\}/g, data?.row[2] || 'author')
    .replace(/\{submissionTitle\}/g, data?.title)
    .replace(/\{submissionId\}/g, data?.id)
    .replace(/\{contactEmail\}/g, 'jdh.admin@uni.lu')
    .replace(/\{signature\}/g, 'JDH Team')
}

const ContactForm = ({ rowData, rowAction, onClose, onNotify }) => {
  const action = rowAction.toLowerCase()
  const pid = rowData.id || ''
  const { t } = useTranslation()
  const { isModalOpen, openModal, closeModal, setFormData, formData } = useFormStore()

  useEffect(() => {
    switch (action) {
      case 'copyediting':
        setFormData({
          pid: pid,
          from: 'jdh.admin@uni.lu',
          subject: t('email.copyediting.subject'),
          body: formatMessage(parse(t(`email.${action}.body`)), rowData),
        })
        break
      default:
        setFormData({
          pid: pid,
          from: 'jdh.admin@uni.lu',
          to: rowData.contactEmail,
          subject: rowData.title,
          body: formatMessage(parse(t(`email.${action}.body`)), rowData),
          status: action || '',
        })
        break
    }
  }, [rowData, action])

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
    let schema: Record<string, any>
    switch (action) {
      case 'copyediting':
        schema = contactFormCopyEditingSchema
        break
      default:
        schema = contactFormSchema
    }

    const { valid, errors } = validateForm(formData, schema)

    if (valid) {
      try {
        let res: any
        switch (action) {
          case 'copyediting':
            await sendArticleToCopyeditor(formData).then(
              async (res) =>
                // onClose() &&
                // setLoadingRow(pid) &&
                await patchArticleStatus({ status: 'COPY_EDITING' }, rowData.id)
                  .then((res) => {
                    setTimeout(() => {
                      onNotify({
                        type: 'success',
                        message: 'Article status updated',
                      })
                    }, 1000)
                  })
                  .catch((error) => {
                    console.error('Failed to send Article to OJS :', error)
                    setTimeout(() => {
                      onNotify({
                        type: 'error',
                        message: 'Failed to update Article status',
                        submessage: error.message,
                      })
                    }, 1000)
                  }),
            )
            break
          default:
            res = await modifyAbstractStatusWithEmail(formData?.pid, formData)
        }

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
            submessage: err?.error,
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
      {action != 'copyediting' && (
        <label>
          To
          <input name="to" value={formData?.to} onChange={handleChange} required />
        </label>
      )}
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
      <Button
        type="submit"
        text={t('contactForm.send', 'Send')}
        dataTestId="contact-form-send-button"
      />
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
