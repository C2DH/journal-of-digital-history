import './ConfirmationModal.css'

import { ConfirmationModalProps } from './interface'

import Button from '../Buttons/Button/Button'

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="small-modal-backdrop">
      <div className="small-modal-content">
        <h2>Confirm</h2>
        <button className="modal-close" onClick={onCancel}>
          ×
        </button>
        <p>{message}</p>
        <Button type="submit" text="Send" onClick={onConfirm} />
        <Button text="Cancel" onClick={onCancel} />
      </div>
    </div>
  )
}

export default ConfirmationModal
