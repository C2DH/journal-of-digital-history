import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleToC from './ArticleToC'
import ArticleStream from './ArticleStream'
import SwitchLayer from '../SwitchLayer'

const ArticleText = ({
  memoid,
  paragraphs,
  headingsPositions,
  onDataHrefClick,
  className='mt-5',
  disableSwitchLayer
}) => {
  return (
    <div className={`${className} ArticleText`}>
      <div className='ArticleText_toc' style={{
        position: 'fixed',
        top: 160,
        right: 70
      }}>
        <Container fluid style={{position: 'absolute'}}>
          <Row>
            <Col {...{
              md: { offset: 10, span: 2}
            }}>
              <div className="d-flex flex-row-reverse">
                <div className="mr-3">
                  {!disableSwitchLayer && <SwitchLayer />}
                  {/* <div className="rounded border border-dark">N</div>*/}
                  <ArticleToC
                    paragraphs={paragraphs}
                    headingsPositions={headingsPositions}
                    active
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ArticleStream
        memoid={memoid}
        cells={paragraphs}
        onDataHrefClick={onDataHrefClick}
        anchorPrefix='C-'
      />
    </div>
  )
}

export default ArticleText;
