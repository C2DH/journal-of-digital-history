import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from "react-bootstrap"
import SwitchLanguageLink from './SwitchLanguageLink'


export default function SwitchLanguage({
  title='untitled',
  className,
  // size='sm',
  // alignement='left',
  langs=[]
}) {
  const { i18n } = useTranslation()
  return(
    <Dropdown id="dropdown-basic-button" className={className} drop='down'>
      <Dropdown.Toggle as='a' className='nav-link'>{title}</Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu-right'>
        {langs.map((lang) => (
          <Dropdown.Item
            as={SwitchLanguageLink}
            lang={lang}
            onClick={() => {
              i18n.changeLanguage(lang)
            }}
            key={lang}
            active={i18n.language === lang}
          >
            {lang.split('_')[0]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
