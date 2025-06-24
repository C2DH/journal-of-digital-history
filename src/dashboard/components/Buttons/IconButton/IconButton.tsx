import { Github } from 'iconoir-react'

import { convertOrcid } from '../../../utils/table'

import './IconButton.css'

const IconButton = (value: any) => {
  let content = value.value

  if (!content.startsWith('http')) {
    content = convertOrcid(content)
  }

  try {
    let icon: React.ReactNode = null
    const url = new URL(content)
    const mainDomain = url.hostname.split('.').slice(-2, -1)[0]

    if (mainDomain === 'github') {
      icon = <Github className="github-icon" data-testid="github-icon" />
    } else if (mainDomain === 'orcid') {
      icon = (
        <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="orcid"></img>
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
