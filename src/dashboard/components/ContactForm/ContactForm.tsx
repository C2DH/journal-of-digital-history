import './ContactForm.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { contactFormSchema } from '../../schemas/contactForm'
import { contactFormCopyEditingSchema } from '../../schemas/copyediting'
import { useFormStore, useNotificationStore } from '../../store'
import { modifyAbstractStatusWithEmail, patchArticleStatus } from '../../utils/api/api'
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

const ContactForm = ({ rowData, rowAction, onClose }) => {
  const action = rowAction.toLowerCase()
  const pid = rowData.id || ''
  const { t } = useTranslation()
  const { isModalOpen, openModal, closeModal, setFormData, formData } = useFormStore()
  const { setNotification } = useNotificationStore()

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

  const sendEmail = async () => {
    setTimeout(() => {
      console.log('send email')
    }, 5000)
  }

  const closeBothModal = () => {
    closeModal()
    onClose()
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
      switch (action) {
        case 'copyediting':
          setNotification({
            type: 'warning',
            message: t('notification.copyediting.warning'),
          })
          closeBothModal()
          await sendEmail()
            // await sendArticleToCopyeditor(formData)
            .then(async (res) => {
              await patchArticleStatus({ status: 'COPY_EDITING' }, rowData.id)
                .then((res) => {
                  setTimeout(() => {
                    setNotification({
                      type: 'success',
                      message: t('notification.status.error.abstract'),
                    })
                  }, 2000)
                })
                .catch((error) => {
                  setTimeout(() => {
                    setNotification({
                      type: 'error',
                      message: t('notification.status.error.article'),
                      submessage: error.message,
                    })
                  }, 2000)
                })
            })
            .catch((error) => {
              setNotification({
                type: 'error',
                message: t('notification.copyediting.error'),
                submessage: error.message,
              })
            })
          break
        default:
          await modifyAbstractStatusWithEmail(formData?.pid, formData)
            .then((res) => {
              closeBothModal()
              setNotification({
                type: 'success',
                message: t('email.success.api.contactForm'),
                submessage: res?.data?.message || '',
              })
            })
            .catch((error) => {
              closeBothModal()
              setNotification({
                type: 'error',
                message: t('email.error.api.message'),
                submessage: error?.error,
              })
            })
      }
    }
    if (!valid) {
      setNotification({
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
