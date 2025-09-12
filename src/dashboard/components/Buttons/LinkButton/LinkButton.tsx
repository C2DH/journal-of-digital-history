import './LinkButton.css'

import { Github, Link, NavArrowRight } from 'iconoir-react'

import { ButtonLinkProps } from './interface'

import BinderIcon from '../../../../assets/images/mybinder_logo_icon_blue.svg?url'

const LinkButton = ({ url }: ButtonLinkProps) => {
  const { hostname, pathname } = new URL(url)

  const linkConfigs = {
    'github.com': {
      icon: <Github className="github-icon" data-testid="github-icon" />,
      label: pathname,
    },
    'mybinder.org': {
      icon: <img className="mybinder-icon" alt="Binder Icon" src={BinderIcon} />,
      label: 'Binder url',
    },
    'journalofdigitalhistory.org': {
      icon: <span className="preview-icon material-symbols-outlined">preview</span>,
      label: 'Notebook preview',
    },
  }

  const config = linkConfigs[hostname] || {
    icon: <Link className="link-icon" data-testid="link-icon" />,
    label: pathname,
  }

  return (
    <a href={url} className="button-link" target="_blank" rel="noopener noreferrer">
      <div className={`link-container`}>
        <div className="link-content">
          {config.icon}
          <span>{config.label}</span>
        </div>
        <NavArrowRight className="arrow-right" />
      </div>
    </a>
  )
}

export default LinkButton
