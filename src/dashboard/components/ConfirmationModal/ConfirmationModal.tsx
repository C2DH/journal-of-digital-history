import './ConfirmationModal.css'

import { ConfirmationModalProps } from './interface'

import Button from '../Buttons/Button/Button'

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="confirmation-modal-backdrop">
      <div className="confirmation-modal-content" data-testid="confirmation-modal">
        <h2 className="confirm-header">Confirm</h2>
        <button
          className="confirmation-modal-close"
          onClick={onCancel}
          data-testid="confirmation-modal-close-button"
        >
          ×
        </button>
        <p>{message}</p>
        <div className="confirmation-modal-buttons">
          <Button
            type="submit"
            text="Send"
            onClick={onConfirm}
            dataTestId="confirmation-modal-send-button"
          />
          <Button
            text="Cancel"
            variant="secondary"
            onClick={onCancel}
            dataTestId="confirmation-modal-cancel-button"
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
