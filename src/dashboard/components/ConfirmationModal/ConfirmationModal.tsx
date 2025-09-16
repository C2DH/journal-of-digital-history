import './ConfirmationModal.css'

import { ConfirmationModalProps } from './interface'

import Button from '../Buttons/Button/Button'

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="confirmation-modal-backdrop">
      <div className="confirmation-modal-content">
        <h2 className="confirm-header">Confirm</h2>
        <button className="confirmation-modal-close" onClick={onCancel}>
          ×
        </button>
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          <Button type="submit" text="Send" onClick={onConfirm} />
          <Button text="Cancel" variant="secondary" onClick={onCancel} />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
