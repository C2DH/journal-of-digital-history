import React, { useEffect } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { BootstrapColumLayout } from '../constants'
import { useStore } from '../store'
import ipynb from '../data/mock-api/mock-guidelines.ipynb.json'
import { downloadFile } from '../logic/api/downloadData'
import { Download } from 'react-feather';

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
            <a className="btn btn-primary rounded" onClick={(e) => {
              e.preventDefault()
              downloadFile({
                url: '/proxy-githubusercontent/C2DH/jdh-notebook/master/author_guideline_template.ipynb',
                filename: 'author_guideline_template.ipynb'
              })
            }} href="#download">
              {t('pages.guidelines.downloadArticleTemplate')}
              <Download className="ml-2" size={16} color="var(--dark)"/>
            </a>
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
          <Col {...BootstrapColumLayout}>
            <div className="position-relative" style={{paddingTop: `${100*388/640}%`}}>
              <div className="position-absolute h-100 w-100" style={{top: 0}}>
              <iframe title="Run Ansible Tasks from a Jupyter Notebook!"
                src="https://player.vimeo.com/video/279049946" width="100%" height="100%"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen>
              </iframe>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          {basis.map((props, i) => (
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
