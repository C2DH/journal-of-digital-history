import './SmallCard.css'

export const SmallCard = ({ children, className = '' }) => (
  <div className={`small-card ${className}`}>{children}</div>
)
