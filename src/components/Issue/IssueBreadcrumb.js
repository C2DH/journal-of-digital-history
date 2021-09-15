import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Nav } from 'react-bootstrap'
import LangNavLink from '../LangNavLink'
import { useIssueStore } from '../../store'


const IssueBreadcumb = ({ to, label }) => {
  const { t } = useTranslation()
  const issue = useIssueStore(state => state.issue)
  console.info('IssueBreadcumb rerendered')
  const { pathname } = useLocation()
  const [, issuePid] = pathname.match(/^\/[a-z]+\/issue\/([a-z]+\d+)/) ?? [null, null]

  return(
    <Nav.Item className="d-flex flex-nowrap">
      <LangNavLink to={to} className="px-0" active={pathname.match(/^\/[a-z]+\/issues\/?/)}>
        <span style={{
          marginRight: issuePid || issue?.pid ? 0 : null
        }}>{t(label)}</span>
      </LangNavLink>
      {issuePid || issue?.pid ? (
        <LangNavLink className="px-0" to={to} active style={{
          width:100,
          top: -0,
        }}>&nbsp;/&nbsp;<span>{issuePid || issue?.pid}</span>
        </LangNavLink>
      ): null}
    </Nav.Item>
  )
}

export default IssueBreadcumb
