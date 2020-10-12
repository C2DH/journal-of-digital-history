import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from "react-bootstrap"


export default function Home(){
  const { t } = useTranslation()
  return (
    <Container>
      <h1>Explore our issues</h1>
      <h2>{t('start')}</h2>
    </Container>
  );
}
