import './Modal.css'

import { ModalProps } from './interface'

import ContactForm from '../ContactForm/ContactForm'

const Modal = ({ open, onClose, action, rowData }: ModalProps) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {action && <h2>{action}</h2>}
        <ContactForm data={rowData} action={action.toLowerCase()} />
      </div>
    </div>
  )
}

export default Modal
