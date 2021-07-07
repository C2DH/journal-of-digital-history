import React from 'react'
import { Accordion, Container, Row, Col, OverlayTrigger, Tooltip, useAccordionToggle } from 'react-bootstrap'
import ArticleCell from './ArticleCell'
import { Box } from 'react-feather'
import { BootstrapColumLayout } from '../../constants'
const ArticleCellAccordionCustomToggle = ({ children, className, eventKey, ...props }) => {
  const clickHandler = useAccordionToggle(eventKey)

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 0, hide: 0 }}
      overlay={
        <Tooltip id="button-tooltip">
          Show/hide the hidden layer
        </Tooltip>
      }
    >
      <button
        className="btn btn-outline-secondary btn-sm position-absolute"
        onClick={clickHandler}
        style={{
          right: 30,
          height: 26,
          width: 26,
          padding: 2,
          lineHeight: 0,
          whiteSpace: 'nowrap',
          borderRadius: 30,
          background: 'white'
        }}
      >
        <Box size="16"/>
      </button>
    </OverlayTrigger>
  );
}

const ArticleCellAccordion = ({
  cell,
  memoid='',
  num=0,
  isActive=isActive,
  isEnabled=true,
  isCollapsed=false
}) => {

  return (
    <Accordion
      defaultActiveKey={isCollapsed ? null: cell.idx}
      className={isEnabled ? 'border-bottom border-dark': ''}>
      {isEnabled ? (
        <Container >
          <Row>
            <Col {...BootstrapColumLayout } className="position-relative">
              <div className="position-absolute" style={{
                zIndex: 1,
                left: 0,
                top: -12,
              }}>
                <ArticleCellAccordionCustomToggle
                  eventKey={cell.idx}

                >

                </ArticleCellAccordionCustomToggle>
              </div>
              </Col>
            </Row>
        </Container>
      ):null}
      <Accordion.Collapse eventKey={cell.idx} >
        <ArticleCell
          memoid={memoid}
          {...cell}
          num={num}
          idx={cell.idx}
          active={isActive}
        />
      </Accordion.Collapse>
    </Accordion>
  )
}

export default ArticleCellAccordion
