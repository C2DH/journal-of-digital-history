import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleToC from './ArticleToC'
import ArticleShadowLayer from './ArticleShadowLayer'
import ArticleScrollama from './ArticleScrollama'
import { LayerHermeneuticsStep } from '../../constants'


const ArticleText = ({
  memoid,
  paragraphs, paragraphsPositions, headingsPositions,
  onDataHrefClick,
  debug, height, width,
  title, abstract, keywords, contributor, publicationDate, url, disclaimer
}) => {
  const [currentStep, setCurrentStep] = useState({idx: -1, direction: 'down'})
  // get
  return (
    <div className="mt-5 ArticleText">
      <div className='ArticleText_toc' style={{
        position: 'fixed',
        top: 160,
        right: 70
      }}>
        <Container fluid style={{position: 'absolute'}}><Row><Col {...{
          md: { offset: 10, span: 2}
        }}>
          <div className="d-flex flex-row-reverse">
            <div className="mr-3">
              {/* <div className="rounded border border-dark">N</div>*/}
              <ArticleToC
                headingsPositions={headingsPositions}
                steps={paragraphs} active
                step={paragraphsPositions[currentStep.idx]}
              />
            </div>
          </div>
        </Col></Row></Container>
      </div>
      <ArticleShadowLayer
        height={height} width={width} title={title}
        abstract={abstract}
        keywords={keywords}
        contributor={contributor}
        publicationDate={publicationDate}
        url={url}
        disclaimer={disclaimer}
        cells={paragraphs.filter(d => d.layer === LayerHermeneuticsStep)} />
      <div className="ArticleText_scrollama" style={{paddingBottom: 200}}>
        <ArticleScrollama
          memoid={memoid}
          cells={paragraphs.filter(d => d.layer !== LayerHermeneuticsStep)}
          onDataHrefClick={onDataHrefClick}
          onStepChange={(step) => setCurrentStep(step)}
        />
      </div>
    </div>
  )
}

export default ArticleText;
