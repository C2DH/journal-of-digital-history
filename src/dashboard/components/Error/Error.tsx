import { WarningCircle } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import './Error.css'

const Error = ({ error }: { error: string }) => {
  const { t } = useTranslation()

  return (
    <div className="card card-error error-container">
      <div className="error-icon-bg">
        <WarningCircle color="var(--color-white)" width={48} height={48} />
      </div>
      <h3 className="error-title">{t('Error')}</h3>
      <p className="error-message">{error}</p>
    </div>
  )
}

export default Error
