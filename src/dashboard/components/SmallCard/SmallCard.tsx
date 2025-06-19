import './SmallCard.css'

const SmallCard = ({ children, className = '' }) => (
  <div className={`small-card ${className}`}>{children}</div>
)

export default SmallCard
