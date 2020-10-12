import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from "react-bootstrap"


export default function Home(){
  const { t } = useTranslation()
  return (
    <Container>
      <h1>Explore our issues</h1>
      <h2>{t('start')}</h2>
      <div className="jumbotron">
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">I was already convinced that jupyter notebooks were the best solution. I now think that it is the best and also the only solution that we can put into practice..</p>
        <hr className="my-4" />
        <p>I was already convinced that jupyter notebooks were the best solution. I now think that it is the best and also the only solution that we can put into practice..</p>
        <p className="lead">
          <button className="btn btn-primary btn-lg">Learn more</button>
        </p>
      </div>
    </Container>
  );
}
