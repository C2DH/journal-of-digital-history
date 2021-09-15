import React from 'react'
import { useTranslation } from 'react-i18next'
import { Nav } from 'react-bootstrap'
import LangNavLink from '../LangNavLink'

const IssueBreadcumb = ({ to, label }) => {
  const { t } = useTranslation()
  console.info('rerendered')
  return(
    <Nav.Item>
      <LangNavLink to={to} className="px-0" active>
        <span>{t(label)}</span>
      </LangNavLink>
    </Nav.Item>
  )
}

export default IssueBreadcumb
