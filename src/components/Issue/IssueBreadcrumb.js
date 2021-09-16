import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Nav } from 'react-bootstrap'
import LangNavLink from '../LangNavLink'
import { useIssueStore } from '../../store'


const IssueBreadcumb = ({ to, label }) => {
  const { t } = useTranslation()
  const issue = useIssueStore(state => state.issue)
  const { pathname } = useLocation()
  const [, issuePid] = pathname.match(/^\/[a-z]+\/issue\/([a-z]+\d+)/) ?? [null, null]
  const issueLabel = String(issuePid || issue?.pid || '')
  return(
    <Nav.Item className="d-flex flex-nowrap">
      <LangNavLink to={to} className="px-0" active={pathname.match(/^\/[a-z]+\/issues\/?/)}>
        <span style={{
          marginRight: issueLabel.length ? 0 : null
        }}>{t(label)}</span>
      </LangNavLink>
      {issueLabel.length ? (
        <LangNavLink className="px-0" to={to} active style={{
          whiteSpace: 'nowrap'
        }}>&nbsp;/&nbsp;<span>{issueLabel}</span>
        </LangNavLink>
      ): null}
    </Nav.Item>
  )
}

export default IssueBreadcumb
