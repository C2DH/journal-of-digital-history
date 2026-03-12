import './ContactForm.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { contactFormCopyEditingSchema } from '../../schemas/copyEditing'
import { contactFormSchema } from '../../schemas/form'
import { useFormStore } from '../../store'
import {
  modifyAbstractStatusWithEmail,
  patchArticleStatus,
  sendArticleToCopyeditor,
} from '../../utils/api/api'
import { notify } from '../../utils/helpers/notification'
import { validateForm } from '../../utils/helpers/schema'
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

  const closeBothModal = () => {
    closeModal()
    onClose()
  }

  const handleCopyEditing = async () => {
    notify('warning', t('notification.copyediting.warning'))
    closeBothModal()

    await sendArticleToCopyeditor(formData)
      .then(async (res) => {
        // notify('success', t('notification.copyediting.success'), res.message)
        await patchArticleStatus({ status: 'COPY_EDITING' }, rowData.id)
          .then((res) => {
            notify('success', t('notification.status.success.abstract'), '')
          })
          .catch((error) => {
            notify('error', t('notification.status.error.article'), error.message)
          })
      })
      .catch((error) => {
        notify('error', t('notification.copyediting.error'), error.error, 7000)
      })
  }

  const handleDefaultAction = async () => {
    closeBothModal()

    await modifyAbstractStatusWithEmail(formData?.pid, formData)
      .then((res) => {
        notify('success', t('email.success.api.contactForm'), res?.data?.message)
      })
      .catch((error) => {
        notify('error', t('email.error.api.message'), error?.error)
      })
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
          await handleCopyEditing()
          break
        default:
          await handleDefaultAction()
          break
      }
    }

    if (!valid) {
      notify('error', t('email.error.validation.message'), t('email.error.validation.submessage'))
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
