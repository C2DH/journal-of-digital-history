import './Badge.css'

interface BadgeProps {
  text: string
  variant: 'accent' | 'default'
}

const Badge = ({ text, variant }) => {
  return <div className={`badge ${variant}`}>{text}</div>
}

export default Badge
