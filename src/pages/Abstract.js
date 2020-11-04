import React from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


const Abstract = ({ results }) => {
  const { t } = useTranslation()
  return (
    <>
      <Container>
        <h1 className="display-4">
            {t('abstract')} submitted!
        </h1>
      </Container>
    </>
  )
}

export default Abstract
