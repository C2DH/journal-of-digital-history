import { Github } from 'iconoir-react'

import { ButtonLinkProps } from './interface'
import './LinkButton.css'

const LinkButton = ({ url }: ButtonLinkProps) => {
  const { hostname, pathname } = new URL(url)
  const buttonLabel = pathname
  let isGithub = false

  if (hostname == 'github.com') {
    isGithub = true
  }

  return (
    <a href={url} className="button-link" target="_blank" rel="noopener noreferrer">
      {isGithub && <Github width={20} height={20} data-testid="github-icon" />}
      <button>{buttonLabel}</button>
    </a>
  )
}

export default LinkButton
