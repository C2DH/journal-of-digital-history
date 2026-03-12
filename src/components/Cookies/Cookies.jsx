import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { TermsOfUseRoute } from '../../constants/globalConstants'
import { useTimeout } from '../../hooks/timeout'
import { useStore } from '../../store'
import LangLink from '../LangLink'
import styles from './Cookies.module.scss'

const Cookies = () => {
  const [isStoreReady, setStoreReady] = useState(false)
  const showCookieBanner = useStore((state) => state.showCookieBanner)
  const setAcceptThirdPartyCookies = useStore((state) => state.setAcceptThirdPartyCookies)
  const { t } = useTranslation()
  const handleClickAccept = () => {
    setAcceptThirdPartyCookies(true)
  }
  const handleClickRefuse = () => {
    setAcceptThirdPartyCookies(false)
  }
  console.debug('[Cookies] \n - isStoreReady:', isStoreReady)

  useTimeout(() => {
    setStoreReady(true)
  }, 2000)

  if (!isStoreReady) {
    return null
  }
  console.debug('[Cookies] \n - showCookieBanner:', showCookieBanner)
  if (!showCookieBanner) {
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
          {t('cookies.banner.text')}
        </p>
        <p className={styles.disclaimer}>
          {t('cookies.banner.consent')}
        </p>
        <div className="my-0 my-md-3">
          <Button
            className={styles.AgreeButton}
            onClick={handleClickAccept}
            data-test="cookie-accept-button"
          >
            {t('cookies.banner.accept')}
          </Button>
          <Button
            className={styles.AgreeButton}
            onClick={handleClickRefuse}
            data-test="cookie-refuse-button"
          >
            {t('cookies.banner.refuse')}
          </Button>
        </div>
        <p className={styles.disclaimer}>
          <Trans i18nKey="cookies.banner.termsOfUseLink" values={{ termsOfUseRouteLabel: t(TermsOfUseRoute.label) }}>
            For more information, please refer to our <LangLink to={TermsOfUseRoute.to}>{TermsOfUseRoute.label}</LangLink> (section "Data protection").
          </Trans>
        </p>
      </Container>
    </div>
  )
}

export default Cookies
