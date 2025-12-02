import './Modal.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ModalProps } from './interface'

import ContactForm from '../ContactForm/ContactForm'
import SocialSchedule from '../SocialSchedule/SocialSchedule'

const Modal = ({ item, open, onClose, action, data, onNotify }: ModalProps) => {
  const { t } = useTranslation()

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
        {action && <h2>{t(`actions.${action}`)}</h2>}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {(action === 'Abandoned' ||
          action === 'Accepted' ||
          action === 'Declined' ||
          action === 'Suspended') && (
          <ContactForm
            rowData={data}
            action={action.toLowerCase()}
            onClose={onClose}
            onNotify={onNotify}
          />
        )}
        {(action === 'Bluesky' || action === 'Facebook ') && (
          <SocialSchedule rowData={data} onClose={onClose} onNotify={onNotify ?? (() => {})} />
        )}
        {/* {action === 'actions.change' && (
          <ChangeStatus
            item={item}
            selectedRows={data.selectedRows}
            onClose={onClose}
            onNotify={onNotify}
          />
        )} */}
      </div>
    </div>
  )
}

export default Modal
