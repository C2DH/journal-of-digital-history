import React, { useEffect } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { BootstrapColumLayout } from '../constants'
import { useStore } from '../store'
import ipynb from '../data/mock-api/mock-guidelines.ipynb.json'

const articleTree = getArticleTreeFromIpynb(ipynb)
const sections = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section ?? 'paragraphs')
const { title = [], basis = [], basisDescription=[], datavis=[], paragraphs = []  } = sections

const Guidelines = () => {
  const { t } = useTranslation()
  let idx = 0
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--white)' });
  }, [])
  return (
    <>
      <Container className="page">
        <Row>
          <Col {...BootstrapColumLayout}>
            {title.concat(paragraphs).map((props, i) => (
              <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
            ))}
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapColumLayout}>
            {basisDescription.map((props, i) => (
              <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
            ))}
          </Col>
        </Row>
        <Row>
          {basis.map((props, i) => (
            <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <ArticleCellContent hideNum hideIdx={false} {...props} idx={idx += 1}/>
            </Col>
          ))}
        </Row>
        <Row>
          <Col md={{offset:2}}>
            <h2 className="my-5">{t('pages.guidelines.datavis')}</h2>
          </Col>
        </Row>
        <Row>
          {datavis.map((props, i) => (
            <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <ArticleCellContent hideNum hideIdx={false} {...props} idx={idx += 1}/>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default Guidelines
