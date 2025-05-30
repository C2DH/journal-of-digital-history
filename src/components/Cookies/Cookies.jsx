import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Container } from 'react-bootstrap'
import { useStore } from '../../store'
import { TermsOfUseRoute } from '../../constants/globalConstants'
import LangLink from '../LangLink'
import styles from './Cookies.module.scss'
import { useTimeout } from '../../hooks/timeout'

const Cookies = ({ defaultAcceptCookies }) => {
  const [isStoreReady, setStoreReady] = useState(false)
  const acceptCookies = useStore((state) => state.acceptCookies)
  const acceptAnalyticsCookies = useStore((state) => state.acceptAnalyticsCookies)
  const setAcceptCookies = useStore((state) => state.setAcceptCookies)
  const setAcceptAnalyticsCookies = useStore((state) => state.setAcceptAnalyticsCookies)
  const { t } = useTranslation()
  const handleChange = (e) => {
    setAcceptAnalyticsCookies(e.target.checked)
  }
  const handleClickAgree = () => {
    setAcceptCookies()
  }
  console.debug('[Cookies] \n - isStoreReady:', isStoreReady)

  useTimeout(() => {
    setStoreReady(true)
  }, 2000)

  if (defaultAcceptCookies || !isStoreReady) {
    return null
  }
  console.debug('[Cookies] \n - acceptCookies:', acceptCookies)
  if (acceptCookies) {
    return null
  }
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        background: 'var(--secondary)',
        color: 'white',
        width: '100%',
        zIndex: 1060,
      }}
    >
      <Container className="py-4">
        <p className={styles.disclaimer}>
          We uses cookies and other data to deliver, maintain and improve the platform (
          <b>"functional" cookies</b>).
        </p>
        <Form>
          <Form.Switch
            id="agree-analytics-data"
            label="I also agree sending analytics data"
            checked={acceptAnalyticsCookies === true}
            onChange={handleChange}
          />
        </Form>
        <p className={styles.agreement}>
          By browsing this website you agree to our cookie policy. Visit{' '}
          <LangLink to={TermsOfUseRoute.to}>{t(TermsOfUseRoute.label)}</LangLink> to review your
          options later.
        </p>
        <div className="mx-3 my-0 my-md-3">
          <Button
            className={styles.AgreeButton}
            onClick={handleClickAgree}
            data-test="cookie-agree-button"
          >
            Agree
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default Cookies
