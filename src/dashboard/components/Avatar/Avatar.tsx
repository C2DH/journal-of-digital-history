import './Avatar.css'
import { UserAvatarProps } from './interface'

const pastelColors = [
  '#FF69B4',
  '#40E0D0',
  '#8A2BE2',
  '#00CED1',
  '#BA55D3',
  '#00BFFF',
  '#FF1493',
  '#05cd99',
]

function getRandomPastelColor() {
  return pastelColors[Math.floor(Math.random() * pastelColors.length)]
}

const Avatar = ({ username, onLogout }: UserAvatarProps) => {
  if (!username) return null
  const firstLetter = username.charAt(0).toUpperCase()
  const bgColor = getRandomPastelColor()

  return (
    <div className="avatar" title="Logout" onClick={onLogout} style={{ backgroundColor: bgColor }}>
      {firstLetter}
    </div>
  )
}

export default Avatar
