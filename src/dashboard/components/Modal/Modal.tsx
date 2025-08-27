import './Modal.css'

import { useTranslation } from 'react-i18next'

import { ModalProps } from './interface'

import ChangeStatus from '../ChangeStatus/ChangeStatus'
import ContactForm from '../ContactForm/ContactForm'

const Modal = ({ item, open, onClose, action, data, onNotify }: ModalProps) => {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {action && <h2>{t(`actions.${action}`)}</h2>}
        {action !== 'change.status' && (
          <ContactForm
            rowData={data}
            action={action.toLowerCase()}
            onClose={onClose}
            onNotify={onNotify}
          />
        )}
        {action === 'change.status' && (
          <ChangeStatus
            item={item}
            selectedRows={data.selectedRows}
            onClose={onClose}
            onNotify={onNotify ?? (() => {})}
          />
        )}
      </div>
    </div>
  )
}

export default Modal
