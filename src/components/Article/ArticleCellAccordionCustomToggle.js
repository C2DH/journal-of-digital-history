import React, { useContext} from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContext, OverlayTrigger, Tooltip, useAccordionButton } from 'react-bootstrap'
// global context aware
import { useArticleStore } from '../../store'
import { Layers, MinusSquare } from 'react-feather'

const ArticleCellAccordionCustomToggle = ({ children, eventKey, title='', truncatedTitle='' }) => {
  const { t } = useTranslation()
  const { activeEventKey } = useContext(AccordionContext);
  const setVisibleShadowCell = useArticleStore(state=>state.setVisibleShadowCell)
  const clickHandler = useAccordionButton(eventKey, () => {
    setVisibleShadowCell(eventKey, !(activeEventKey === eventKey))
  })
  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <>
    <OverlayTrigger
      placement="right"
      delay={{ show: 0, hide: 0 }}
      overlay={
        <Tooltip id="button-tooltip">
          {isCurrentEventKey
            ? t('actions.hideHermeneuticLayer')
            : title.length
              ? title
              : t('actions.showHermeneuticLayer')
          }
        </Tooltip>
      }
    >
      <button
        className={`ArticleCellAccordionCustomToggle btn btn-outline-secondary btn-sm position-absolute ${isCurrentEventKey ? 'active': ''}`}
        onClick={clickHandler}
      >
        <span className="monospace">
        {isCurrentEventKey
          ? <MinusSquare size="16" color="white"/>
          : <Layers size="16" color="var(--primary-dark)"/>
        } {children}&nbsp;
        </span>
        {truncatedTitle.length ? <span className="ms-3 fst-italic me-2">{truncatedTitle}</span>: null}
      </button>
    </OverlayTrigger>
    </>
  );
}

export default ArticleCellAccordionCustomToggle
