import React, {useEffect, useContext} from 'react'
import { Accordion, Container, Row, Col, AccordionContext } from 'react-bootstrap'
import ArticleCellAccordionCustomToggle from './ArticleCellAccordionCustomToggle'
import { BootstrapColumLayout } from '../../constants'
import { useOnScreen } from '../../hooks/graphics'
import { useArticleStore } from '../../store'

const ArticleCellAccordion = ({
  eventKey=0,
  size=0,
  isEnabled=true,
  title='',
  truncatedTitle='',
  onVisibilityChange,
  children
}) => {
  const visibleShadowCellsIdx = useArticleStore(state=>state.visibleShadowCellsIdx)
  const isOpen = visibleShadowCellsIdx.indexOf(eventKey) !== -1
  const [{ isIntersecting, intersectionRatio }, ref] = useOnScreen({
    rootMargin: '-40% 0% -25% 0%',
    threshold: [0, 0.25, 0.75, 1]
  })
  const { activeEventKey } = useContext(AccordionContext);
  // trigger visibilityChange.
  useEffect(() => {
    if (typeof onVisibilityChange === 'function') {
      onVisibilityChange({ idx: eventKey, isIntersecting })
    }
  }, [intersectionRatio])

  return (
    <div ref={ref} className={`ArticleCellAccordion ${intersectionRatio > 0 ? 'active': ''}`}>
    {isOpen?'isOpen':'isClosed'} {eventKey} {activeEventKey}
    <Accordion flush>
      {isEnabled ? (
        <Container >
          <Row>
            <Col {...BootstrapColumLayout } className="position-relative ArticleCellAccordion_button">
              <div className="position-absolute" style={{
                zIndex: 1,
                left: 0,
                top: -15,
              }}>
                <ArticleCellAccordionCustomToggle isOpen={isOpen}
                  eventKey={eventKey} title={title}
                  truncatedTitle={truncatedTitle}
                >
                    <b>{size}</b> x
                </ArticleCellAccordionCustomToggle>
              </div>
              </Col>
            </Row>
        </Container>
      ): null}
      <Accordion.Collapse eventKey={eventKey}>
        <div className="py-0 my-0" style={{}}>
        { children }
        </div>
      </Accordion.Collapse>
    </Accordion>
    </div>
  )
}

export default ArticleCellAccordion
