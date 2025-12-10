import './LinkButton.css'

import { Github, Link, NavArrowRight } from 'iconoir-react'

import { ButtonLinkProps } from './interface'

import DjangoIcon from '../../../../assets/images/django_logo_blue.svg?url'
import BinderIcon from '../../../../assets/images/mybinder_logo_icon_blue.svg?url'

const LinkButton = ({ url }: ButtonLinkProps) => {
  const { hostname, pathname } = new URL(url)

  if (pathname.includes('/admin/')) {
    return (
      <a
        href={url}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="link-button"
      >
        <div className={`link-container`}>
          <div className="link-content">
            <img
              className="mydjango-icon"
              alt="Django Icon"
              src={DjangoIcon}
              data-testid="django-icon"
            />
            <span>Django admin page</span>
          </div>
          <NavArrowRight className="arrow-right" />
        </div>
      </a>
    )
  }

  const linkConfigs = {
    'github.com': {
      icon: <Github className="github-icon" data-testid="github-icon" />,
      label: pathname,
    },
    'mybinder.org': {
      icon: (
        <img
          className="mybinder-icon"
          alt="Binder Icon"
          src={BinderIcon}
          data-testid="binder-icon"
        />
      ),
      label: 'Binder url',
    },
    'journalofdigitalhistory.org': {
      icon: (
        <span className="preview-icon material-symbols-outlined" data-testid="preview-icon">
          preview
        </span>
      ),
      label: 'Notebook preview',
    },
  }

  const config = linkConfigs[hostname] || {
    icon: <Link className="link-icon" data-testid="link-icon" />,
    label: pathname,
  }

  return (
    <a
      href={url}
      className="link"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="link-button"
    >
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
