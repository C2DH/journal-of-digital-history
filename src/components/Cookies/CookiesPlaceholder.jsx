import { useStore } from '../../store';
import { Trans } from 'react-i18next';
import styles from './Cookies.module.scss';

const CookiesPlaceholder = ({
    height = '200px'
}) => {

  // const setAcceptThirdPartyCookies = useStore((state) => state.setAcceptThirdPartyCookies);
  const setShowCookieBanner = useStore((state) => state.setShowCookieBanner);

  return (
    <div style={{ height }} className={styles.CookiesPlaceholder}>
      <p>
        <Trans i18nKey="cookies.placeholder.text">External content blocked for privacy.</Trans>
      </p>
      <p>
        <Trans i18nKey="cookies.placeholder.consent">Enable <a onClick={() => setShowCookieBanner(true)}>cookies</a> to view this media.</Trans>
      </p>
      </div>
  )
}

export default CookiesPlaceholder;