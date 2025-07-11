import { Github } from 'iconoir-react'
import './LinkButton.css'

import { ButtonLinkProps } from './interface'

const LinkButton = ({ url }: ButtonLinkProps) => {
  const { hostname, pathname } = new URL(url)
  const buttonLabel = pathname
  let isGithub = false

  if (hostname == 'github.com') {
    isGithub = true
  }

  return (
    <a href={url} className="button-link" target="_blank" rel="noopener noreferrer">
      {isGithub && <Github className="github-icon" data-testid="github-icon" />}
      <button className="button-link-label">{buttonLabel}</button>
    </a>
  )
}

export default LinkButton
