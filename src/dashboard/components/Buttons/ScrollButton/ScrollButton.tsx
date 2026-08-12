import { useTranslation } from 'react-i18next'
import './ScrollButton.css'

const ScrollButton = () => {
  const { t } = useTranslation()
  return <button className="scroll-button">{t(`card.scrollTo`)}</button>
}

export default ScrollButton
