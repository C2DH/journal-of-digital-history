import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { TermsOfUseRoute } from '../../constants/globalConstants'
import { useTimeout } from '../../hooks/timeout'
import { useStore } from '../../store'
import LangLink from '../LangLink'
import styles from './Cookies.module.scss'

const Cookies = ({ defaultAcceptCookies }) => {
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

  if (defaultAcceptCookies || !isStoreReady) {
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
          This website uses essential cookies necessary for its proper functioning.
        </p>
        <p className={styles.disclaimer}>
          With your consent, we may also use third-party cookies (Vimeo, Sketchfab, etc.) to display embedded content from external sources. Without your consent, these contents will remain blocked.
        </p>
        <div className="my-0 my-md-3">
          <Button
            className={styles.AgreeButton}
            onClick={handleClickAccept}
            data-test="cookie-accept-button"
          >
            Accept
          </Button>
          <Button
            className={styles.AgreeButton}
            onClick={handleClickRefuse}
            data-test="cookie-refuse-button"
          >
            Refuse
          </Button>
        </div>
        <p className={styles.disclaimer}>
          For more information, please refer to our <LangLink to={TermsOfUseRoute.to}>{t(TermsOfUseRoute.label)}</LangLink> (section "Data protection").
        </p>
      </Container>
    </div>
  )
}

export default Cookies
