import './Modal.css'

import { useTranslation } from 'react-i18next'

import { ModalProps } from './interface'

import ContactForm from '../ContactForm/ContactForm'
import SocialSchedule from '../SocialSchedule/SocialSchedule'

const Modal = ({ item, open, onClose, action, data, onNotify }: ModalProps) => {
  const { t } = useTranslation()

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
        {action === 'SocialMediaCampaign' && <SocialSchedule />}
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
