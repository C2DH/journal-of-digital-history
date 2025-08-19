import './Feedback.css'

import { WarningCircle } from 'iconoir-react'
import { useTranslation } from 'react-i18next'

const Feedback = ({ type, message }: { type: string; message: string }) => {
  const { t } = useTranslation()

  return (
    <div className="feedback-container">
      <div className={`feedback-icon-bg-${type}`}>
        <WarningCircle color="var(--color-white)" width={48} height={48} />
      </div>
      <h3 className="feedback-title">{t(`${type}.general`)}</h3>
      <p className="feedback-message">{message}</p>
    </div>
  )
}

export default Feedback
