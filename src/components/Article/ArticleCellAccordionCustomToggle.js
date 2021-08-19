import React from 'react'
import { useTranslation } from 'react-i18next'
import { OverlayTrigger, Tooltip, AccordionContext } from 'react-bootstrap'
// global context aware
import { useArticleStore } from '../../store'
import { Layers, MinusSquare } from 'react-feather'

const ArticleCellAccordionCustomToggle = ({ children, isOpen, eventKey, title='', truncatedTitle='' }) => {
  const { t } = useTranslation()
  const { onSelect } = React.useContext(AccordionContext);
  const setVisibleShadowCell = useArticleStore(state=>state.setVisibleShadowCell)

  const clickHandler = () => {
    setVisibleShadowCell(eventKey, !isOpen)
  }

  React.useEffect(() => {
    if (isOpen) {
      onSelect(eventKey)
    } else {
      onSelect(null)
    }
  }, [eventKey, isOpen])

  return (
    <>
    <OverlayTrigger
      placement="right"
      delay={{ show: 0, hide: 0 }}
      overlay={
        <Tooltip id="button-tooltip">
          {isOpen
            ? t('actions.hideHermeneuticLayer')
            : title.length
              ? title
              : t('actions.showHermeneuticLayer')
          }
        </Tooltip>
      }
    >
      <button
        className={`ArticleCellAccordionCustomToggle btn btn-outline-secondary btn-sm position-absolute ${isOpen ? 'active': ''}`}
        onClick={clickHandler}
      >
        <span className="monospace">
        {isOpen
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
