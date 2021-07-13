import React, { useContext} from 'react'
import { Accordion, AccordionContext, Container, Row, Col, OverlayTrigger, Tooltip, useAccordionButton } from 'react-bootstrap'
import { Box } from 'react-feather'
import { BootstrapColumLayout } from '../../constants'


const ArticleCellAccordionCustomToggle = ({ children, eventKey, title }) => {
  const { activeEventKey } = useContext(AccordionContext);
  const clickHandler = useAccordionButton(eventKey)
  const isCurrentEventKey = activeEventKey === eventKey;

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
        className={`ArticleCellAccordionCustomToggle btn btn-outline-secondary btn-sm position-absolute ${isCurrentEventKey ? 'active': ''}`}
        onClick={clickHandler}
      >
        <span className="monospace">
        {children}&nbsp;<Box size="16"/>
        </span>
        {title ? <span className="ms-3 fst-italic me-2">{title}</span>: null}
      </button>
    </OverlayTrigger>
  );
}

const ArticleCellAccordion = ({
  eventKey=0,
  size=0,
  isEnabled=true,
  title='',
  children
}) => {
  return (
    <Accordion
      className={isEnabled ? '': ''} style={{
        minHeight: 4,
        borderBottom: '1px dotted var(--dark)',
        borderTop: '1px solid var(--gray-400)',
        marginBottom: 'var(--spacer-3)',
      }}>
      {isEnabled ? (
        <Container >
          <Row>
            <Col {...BootstrapColumLayout } className="position-relative">
              <div className="position-absolute" style={{
                zIndex: 1,
                left: 0,
                top: -15,
              }}>
                <ArticleCellAccordionCustomToggle eventKey={eventKey} title={title}>
                    <b>{size}</b> x
                </ArticleCellAccordionCustomToggle>
              </div>
              </Col>
            </Row>
        </Container>
      ):null}
      <Accordion.Collapse eventKey={eventKey}>
        <div className="my-3">
        { children }
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default ArticleCellAccordion
