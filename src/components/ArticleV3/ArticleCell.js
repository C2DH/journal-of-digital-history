import React, { useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellFigure from './ArticleCellFigure';
import {
  BootstrapColumLayoutV3,
  BootstrapNarrativeStepColumnLayout,
  ArticleCellContainerClassNames,
  LayerData,
  CellTypeCode,
  CellTypeMarkdown,
} from '../../constants'
import { useExecutionScope } from './ExecutionScope'
import ArticleCellCodeTools from './ArticleCellCodeTools';
import { useArticleThebe } from './ArticleThebeProvider';
import ArticleCellSourceCodeWrapper from './ArticleCellSourceCodeWrapper';

import '../../styles/components/ArticleV3/ArticleCell.scss';


const RegexIsMagic = /^%%(javascript|js)/;


const ArticleCell = ({
  type,
  layer,
  num = 1,
  content = '',

  idx,
  hideNum,
  metadata = {},
  isNarrativeStep,
  figure, // ArticleFigure instance
  isFigure = false,
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  active = false,
  isJavascriptTrusted = false,
  onNumClick,
  renderUsingThebe
}) => {

  const { ready } = useArticleThebe();

  const errors = useExecutionScope((state) => state.cells[idx]?.errors)
  const outputs = useExecutionScope((state) => state.cells[idx]?.outputs) ?? []
  const thebeCell = useExecutionScope((state) => state.cells[idx]?.thebe)

  const tags    = Array.isArray(metadata.tags) ? metadata.tags : [];
  const isMagic = RegexIsMagic.test(content);
  const isolationMode = outputs.some(
    (d) => typeof d.metadata === 'object' && d.metadata['text/html']?.isolated,
  )
  const isCodeEditable = tags.includes('data');

  const ref = useCallback(
    (node) => {
      if (renderUsingThebe && thebeCell && node) {
        const verb = thebeCell.isAttachedToDOM ? 'reattaching' : 'attaching'
        console.debug(`${verb} cell ${thebeCell.id} to DOM at:`, {
          el: node,
          connected: node.isConnected,
        })
        thebeCell.attachToDOM(node)
      }
    },
    [renderUsingThebe, thebeCell],
  )

  let cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayoutV3[layer];
  // we override or set the former layout if it appears in narrative-step
  if (isNarrativeStep) {
    cellBootstrapColumnLayout = BootstrapNarrativeStepColumnLayout
  }

//  // this layout will be applied to module:"object" and module: "text_object"
//  let cellObjectBootstrapColumnLayout =
//    metadata.jdh?.object?.bootstrapColumLayout || BootstrapColumLayout;

  const containerClassNames = [...(metadata.tags ?? []).filter((d) =>
    ArticleCellContainerClassNames.includes(d),
  )];

  console.debug('[ArticleCell]', idx, 'is rendering');

  if (type !== CellTypeMarkdown && type !== CellTypeCode)
    return <div>Unkonwn type: {type}</div>

  return (
    <div className={`ArticleCell ${layer}`}>
      <Container fluid={layer === LayerData} className={containerClassNames.join(' ')}>
        {outputs.length > 0 &&
          <Row>
            <Col {...cellBootstrapColumnLayout}>
              {figure ? (
                <ArticleCellFigure
                  metadata={metadata}
                  outputs={outputs}
                  figure={figure}
                  isolationMode={isolationMode}
                  isMagic={isMagic}
                  active={active}
                  isJavascriptTrusted={isJavascriptTrusted}
                  cellType={type}
                />

              ) : (

                <>
                  {type === CellTypeCode && !errors &&
                    <div ref={ref}>
                      <ArticleCellOutputs
                        isMagic={false}
                        isolationMode={false}
                        isJavascriptTrusted={isJavascriptTrusted}
                        cellIdx={idx}
                        outputs={outputs}
                      />
                    </div>
                  }
                </>
                  
              )}
            </Col>
          </Row>
        }

        {type === CellTypeMarkdown && content &&
          <Row>
            <Col {...cellBootstrapColumnLayout}>
                <ArticleCellContent
                  headingLevel  = {headingLevel}
                  onNumClick    = {onNumClick}
                  hideNum       = {hideNum}
                  layer         = {layer}
                  content       = {content}
                  idx           = {idx}
                  num           = {num}
                />
            </Col>
          </Row>
        }

        {type === CellTypeCode && (!isFigure || !figure?.isCover) &&
          <Row>
            <Col xs={!isCodeEditable ? 12 : 7} className='code'>
              <React.Suspense fallback={<div>loading...</div>}>
                <ArticleCellSourceCodeWrapper
                  cellIdx           = {idx}
                  toggleVisibility  = {!isCodeEditable}
                  visible           = {false}
                  readOnly          = {!ready || !isCodeEditable}
                /> 
              </React.Suspense>
            </Col>

            {isCodeEditable && (
              <Col xs={5} className="p-2">
                <ArticleCellCodeTools
                  cellIdx = {idx}
                  errors  = {errors}
                />
              </Col>
            )}
          </Row>
        }
      </Container>
    </div>
  )
}

export default ArticleCell
