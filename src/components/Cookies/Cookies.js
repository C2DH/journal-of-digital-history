import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Container } from 'react-bootstrap'
import { useStore } from '../../store'
import { TermsOfUseRoute } from '../../constants'
import LangLink from '../LangLink'


const Cookies = ({ defaultAcceptCookies }) => {
    const acceptCookies =  useStore((state) => state.acceptCookies);
    const acceptAnalyticsCookies =  useStore((state) => state.acceptAnalyticsCookies);
    const setAcceptCookies = useStore((state) => state.setAcceptCookies);
    const setAcceptAnalyticsCookies = useStore((state) => state.setAcceptAnalyticsCookies);
    const { t } = useTranslation()
    const handleChange = (e) => {
      setAcceptAnalyticsCookies(e.target.checked)
    }
    const handleClickAgree = (e) => {
      setAcceptCookies()
    }
    if (defaultAcceptCookies || acceptCookies) {
      return null
    }
    return (
      <div style={{position: 'fixed', bottom: 0, background: 'var(--secondary)', color: 'white', width: '100%', zIndex:1060}}>
        <Container className="py-4">
          <p>
            We uses cookies and other data to deliver, maintain and improve
            the platform (<b>"functional" cookies</b>).
            {/*
              <pre style={{color: 'white'}}>{JSON.stringify({acceptCookies, acceptAnalyticsCookies})}</pre>
            */}
          </p>
          <Form>
            <Form.Switch
              id="agree-analytics-data"
              label="I also agree sending analytics data"
              checked={acceptAnalyticsCookies === true}
              onChange={handleChange}
            />
          </Form>
            By browsing this website you agree to our cookie policy.
            Visit <LangLink to={TermsOfUseRoute.to}>{t(TermsOfUseRoute.label)}</LangLink> to review your options later.
            <div className="mx-3 my-3">
            <Button className="btn-block" onClick={handleClickAgree}>Agree</Button>
            </div>
        </Container>
      </div>
    )
}

export default Cookies
