import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import { a, useSpring } from '@react-spring/web'
import './Issue.css'

const Issue = ({
  item,
  numArticles = -1,
  numSelectedArticles = -1,
  isInFilterMode = false,
  moreButton = false,
  className = '',
}) => {
  const ref = useRef()
  const { t } = useTranslation()
  const descriptionRef = useRef()
  const buttonRef = useRef()
  const isOpen = useRef(false)

  const [{ height }, api] = useSpring(() => ({ height: 0 }))
  const label = item.pid?.replace(/jdh0+(\d+)/, (m, n) => t('numbers.issue', { n }))

  const activeClass = isInFilterMode && numSelectedArticles > 0 ? 'active' : ''
  const disabledClass = isInFilterMode && numSelectedArticles < 1 ? 'disabled' : ''

  const toggleHeight = () => {
    isOpen.current = !isOpen.current
    // change label on the button
    buttonRef.current.textContent = isOpen.current ? 'less' : 'more ...'

    api.start({
      height: isOpen.current
        ? descriptionRef.current.offsetHeight
        : Math.min(ref.current.offsetHeight, descriptionRef.current.offsetHeight),
    })
  }

  useLayoutEffect(() => {
    if (moreButton && ref.current) {
      if (ref.current.offsetHeight + 5 < descriptionRef.current.offsetHeight) {
        buttonRef.current.style.display = 'block'
      } else {
        buttonRef.current.style.display = 'none'
      }
      api.set({ height: Math.min(ref.current.offsetHeight, descriptionRef.current.offsetHeight) })
    }
  }, [ref])

  return (
    <Row className={`Issue align-items-start ${className} ${activeClass} ${disabledClass}`}>
      <Col md={{ span: 11 }} lg={{ span: 5 }} ref={ref}>
        {item.status !== 'PUBLISHED' ? <em>{t('status.' + item.status)}</em> : label}
        {isInFilterMode && numSelectedArticles > 0 ? (
          <>
            {label &&
              <>
                &nbsp; &mdash; &nbsp;
              </>
            }
            <div
              className="d-inline-block Issue__numArticles"
              dangerouslySetInnerHTML={{
                __html: t('numbers.articlesFiltered', {
                  n: numSelectedArticles,
                  total: numArticles,
                }),
              }}
            />
          </>
        ) : null}
        {!isInFilterMode && numArticles > 0 ? (
          <>
            {label &&
              <>
                &nbsp; &mdash; &nbsp;
              </>
            }
            <div
              className="d-inline-block Issue__numArticles"
              dangerouslySetInnerHTML={{ __html: t('numbers.articlesInIssue', { n: numArticles }) }}
            />{' '}
          </>
        ) : null}
        <h2>{item.name}</h2>
      </Col>

      <a.div
        className="col col-md-12 col-lg-6 position-relative "
        style={{ overflow: 'hidden', height: moreButton ? height : 'auto' }}
      >
        <p
          className={`m-0 ${moreButton ? 'position-absolute' : ''} top-0`}
          ref={descriptionRef}
          dangerouslySetInnerHTML={{ __html: item.description || ' ' }}
        />
      </a.div>
      {moreButton &&
        <Col md={{ span: 1 }} lg={{ span: 1 }} className="d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary btn-sm btn-rounded"
            ref={buttonRef}
            onClick={toggleHeight}
          >
            more...
          </button>
        </Col>
      }
    </Row>
  )
}

Issue.propTypes = {
  item: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
  numArticles: PropTypes.number,
  numSelectedArticles: PropTypes.number,
  isInFilterMode: PropTypes.bool,
  className: PropTypes.string,
}

export default Issue
