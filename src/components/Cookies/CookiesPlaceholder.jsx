import { useStore } from '../../store';
import styles from './Cookies.module.scss';

const CookiesPlaceholder = ({
    height = '200px'
}) => {

  const setAcceptThirdPartyCookies = useStore((state) => state.setAcceptThirdPartyCookies);

  return (
      <div style={{ height }} className={styles.CookiesPlaceholder}>
          <p>This embedded content (Vimeo, Sketchfab, etc.) is blocked to protect your privacy.</p>
          <p>By clicking <a onClick={() => setAcceptThirdPartyCookies(true)}>here</a>, you consent to the use of third-party cookies on the entire website and this content will be displayed.</p>
      </div>
  )
}

export default CookiesPlaceholder;