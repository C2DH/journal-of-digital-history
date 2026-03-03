import { useStore } from '../../store';
import { Trans } from 'react-i18next';
import styles from './Cookies.module.scss';

const CookiesPlaceholder = ({
    height = '200px'
}) => {

  const setAcceptThirdPartyCookies = useStore((state) => state.setAcceptThirdPartyCookies);

  return (
    <div style={{ height }} className={styles.CookiesPlaceholder}>
      <p>
        <Trans i18nKey="cookies.placeholder.text">This embedded content (Vimeo, Sketchfab, etc.) is blocked to protect your privacy.</Trans>
      </p>
      <p>
        <Trans i18nKey="cookies.placeholder.consent">By clicking <a onClick={() => setAcceptThirdPartyCookies(true)}>here</a>, you consent to the use of third-party cookies on the entire website and this content will be displayed.</Trans>
      </p>
      </div>
  )
}

export default CookiesPlaceholder;