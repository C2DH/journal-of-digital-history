import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'
import { ArrowDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import './ArticleCellPlaceholder.css'

const ArticleCellPlaceholderParagraphNumbers = ({ nums = [], figure = null }) => {
  const { t } = useTranslation()

  return (
    <div>
      {nums.length === 1 ? (
        nums[0]
      ) : (
        <>
          {nums[0]}
          <br />
          <ArrowDown size={15} />
          <br />
          {nums[nums.length - 1]}
        </>
      )}
      {figure ? (
        <div className="ArticleCellPlaceholder__figure text-muted">
          {t(figure.tNLabel, { n: figure.tNum })}
        </div>
      ) : null}
    </div>
  )
}

const ArticleCellPlaceholder = ({
  type = 'code',
  layer,
  // whenever the placeholder stands for more than one paragraphs
  nums = [],
  content = '',
  idx,
  headingLevel = 0,
  figure = null,
  onNumClick,
}) => {
  const paragraphNumbers = ArticleCellPlaceholderParagraphNumbers({ nums, figure })

  const onNumClickHandler = (e) => {
    onNumClick(e, { layer, idx })
  }
  const prefix = figure ? figure.getPrefix() : ''

  return (
    <Container>
      <Row>
        <Col
          className={`ArticleCellPlaceholder  ${prefix === 'table' ? 'figuretable' : ''}`}
          {...BootstrapColumLayout}
        >
          {/* {figure ? (
            <ArticleFigureCaption
              figure={figure}
              className="ArticleCellPlaceholder__ArticleFigureCaption small"
            />
          ) : null} */}
          {type === 'markdown' ? (
            <ArticleCellContent
              headingLevel={headingLevel}
              layer={layer}
              content={content}
              idx={idx}
              num={paragraphNumbers}
              onNumClick={onNumClickHandler}
            />
          ) : (
            <ArticleCellSourceCode
              visible
              content={content}
              language="python"
              num={paragraphNumbers}
              onNumClick={onNumClick}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellPlaceholder
