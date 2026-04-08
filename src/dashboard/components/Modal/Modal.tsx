import './Modal.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ModalProps } from './interface'

import Button from '../Buttons/Button/Button'
import ContactForm from '../ContactForm/ContactForm'
import SocialSchedule from '../SocialSchedule/SocialSchedule'

const Modal = ({ item, open, onClose, action, data }: ModalProps) => {
  const { t } = useTranslation()

  const contactFormActions = ['Abandoned', 'Accepted', 'Declined', 'Suspended', 'Copyediting']
  const isContactFormAction = contactFormActions.includes(action)

  const socialScheduleActions = ['Bluesky', 'Facebook']
  const isSocialScheduleAction = socialScheduleActions.includes(action)

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {action && <h2>{t(`actions.${action}`)}</h2>}
          <div className="modal-actions">
            {isSocialScheduleAction && (
              <Button
                type="submit"
                form="social-campaign-form"
                text={t('socialCampaign.send', 'Send')}
              />
            )}
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        {isContactFormAction && <ContactForm row={data} onClose={onClose} />}
        {isSocialScheduleAction && (
          <SocialSchedule rowData={data} action={action} onClose={onClose} />
        )}
      </div>
    </div>
  )
}

export default Modal
