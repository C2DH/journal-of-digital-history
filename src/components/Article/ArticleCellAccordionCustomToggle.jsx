import React from 'react'
import { useTranslation } from 'react-i18next'
import { OverlayTrigger, Tooltip, AccordionContext } from 'react-bootstrap'
// global context aware
import { useArticleStore } from '../../store'
import { PlusSquare, MinusSquare } from 'react-feather'

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
            ? t('actions.hideShadowLayer')
            : title.length
              ? title
              : t('actions.showShadowLayer')
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
          ? <MinusSquare size="16" />
          : <PlusSquare size="16"/>
        } {children}&nbsp;
        </span>
        {truncatedTitle.length ? <span className="ms-1 fst-italic me-1">{truncatedTitle}</span>: null}
      </button>
    </OverlayTrigger>
    </>
  );
}

export default ArticleCellAccordionCustomToggle
