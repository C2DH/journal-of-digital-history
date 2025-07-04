import './Avatar.css'
import { UserAvatarProps } from './interface'

const Avatar = ({ username, onLogout }: UserAvatarProps) => {
  if (!username) return null
  const firstLetter = username.charAt(0).toUpperCase()

  return (
    <div className="avatar" title="Logout" onClick={onLogout}>
      {firstLetter}
    </div>
  )
}

export default Avatar
