import React, { useEffect } from 'react'
// import { groupBy } from 'lodash'
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
const {title=[], text=[]} = articleTree.sections

console.info('sticazzi',articleTree )

const Guidelines = () => {
  const { t } = useTranslation()
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--white)' });
  }, [])
  return (
    <>
      <Container className="page">
        <Row>
          <Col {...BootstrapColumLayout}>
            {title.concat(text).map((props, i) => (
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
            <div className="position-relative" style={{paddingTop: `${100*388/640}%`}}>
              <div className="position-absolute h-100 w-100" style={{top: 0}}>
              <iframe title="Run Ansible Tasks from a Jupyter Notebook!"
                src="https://player.vimeo.com/video/531679943" width="100%" height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen>
              </iframe>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Guidelines
