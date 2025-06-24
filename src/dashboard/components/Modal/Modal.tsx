import './Modal.css'

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
