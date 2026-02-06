import './IconButton.css'

import { Facebook, Github } from 'iconoir-react'

import BlueskyIcon from '../../../../assets/images/bluesky_blue.svg?url'
import OrcidIconUrl from '../../../../assets/images/orcid_logo_blue_inverted.svg?url'
import { convertOrcid } from '../../../utils/helpers/checkItem'

const IconButton = ({ value }: any) => {
  let content = value

  if (!content.startsWith('http')) {
    content = convertOrcid(content)
  }

  try {
    let icon: React.ReactNode = null
    const url = new URL(content)
    const mainDomain = url.hostname.split('.').slice(-2, -1)[0]

    if (mainDomain === 'github') {
      icon = <Github className="github-icon" data-testid="github-icon" />
    } else if (mainDomain === 'bsky') {
      icon = (
        <img
          className="bluesky-icon"
          src={BlueskyIcon}
          alt="Bluesky Icon"
          style={{ width: '15px' }}
        />
      )
    } else if (mainDomain === 'facebook') {
      icon = <Facebook className="facebook-icon" data-testid="facebook-icon" />
    } else if (mainDomain === 'orcid') {
      icon = (
        <img
          src={OrcidIconUrl}
          alt="ORCID"
          className="icon-svg"
          width="18"
          height="18"
          style={{ display: 'block' }}
          data-testid="orcid-icon"
        />
      )
    } else {
      icon = mainDomain
    }

    return (
      <button
        type="button"
        onClick={() => window.open(content, '_blank')}
        className={`link-button-${mainDomain}`}
      >
        {icon}
      </button>
    )
  } catch {
    return content
  }
}
export default IconButton
