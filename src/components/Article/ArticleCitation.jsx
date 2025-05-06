import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BookOpen } from 'react-feather'
import ArticleCitationModal from './ArticleCitationModal'
import { useTranslation } from 'react-i18next'

const ArticleCitation = (props) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="ArticleCitation" {...props}>
      <Button
        size="sm"
        variant="outline-accent"
        disabled={props.disabled}
        onClick={() => setIsVisible(true)}
      >
        <BookOpen size={12} />
        <span className="ms-2">{t('actions.cite')}</span>
      </Button>

      <ArticleCitationModal
        show={isVisible}
        bibjson={props.bibjson}
        onHide={() => setIsVisible(false)}
      />
    </div>
  )
}

export default ArticleCitation
