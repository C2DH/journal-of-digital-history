import { Github } from 'iconoir-react'

import './GithubLink.css'

type GithubLinkProps = {
  url: string
}

const GithubLink = ({ url }: GithubLinkProps) => {
  const match = url.match(/github\.com(\/.+)/)
  const path = match ? match[1] : url

  return (
    <a href={url} className="github-button" target="_blank" rel="noopener noreferrer">
      <Github width={20} height={20} />
      <button>{path}</button>
    </a>
  )
}

export default GithubLink
