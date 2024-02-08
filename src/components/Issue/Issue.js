import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import { a, useSpring } from '@react-spring/web'

const Issue = ({ item, className = '' }) => {
  const ref = useRef()
  const descriptionRef = useRef()
  const buttonRef = useRef()
  const isOpen = useRef(false)

  const [{ height }, api] = useSpring(() => ({ height: 0 }))
  const { t } = useTranslation()
  const label = item.pid.replace(/jdh0+(\d+)/, (m, n) => t('numbers.issue', { n }))

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
    if (ref.current) {
      if (ref.current.offsetHeight < descriptionRef.current.offsetHeight) {
        buttonRef.current.style.display = 'block'
      } else {
        buttonRef.current.style.display = 'none'
      }
      api.set({ height: Math.min(ref.current.offsetHeight, descriptionRef.current.offsetHeight) })
    }
  }, [ref])

  return (
    <Row className={`Issue align-items-start ${className}`}>
      <Col md={{ span: 11 }} lg={{ span: 5 }} ref={ref}>
        {label} {item.status !== 'PUBLISHED' ? <b>&mdash; {t('status.' + item.status)}</b> : null}
        <h2>{item.name}</h2>
      </Col>

      <a.div
        className="col col-md-12 col-lg-6 position-relative "
        style={{ overflow: 'hidden', height }}
      >
        <p
          className="m-0 position-absolute top-0"
          ref={descriptionRef}
          dangerouslySetInnerHTML={{ __html: item.description || ' ' }}
        />
      </a.div>
      <Col md={{ span: 1 }} lg={{ span: 1 }} className="d-flex justify-content-end">
        <button
          className="btn btn-outline-secondary btn-sm btn-rounded"
          ref={buttonRef}
          onClick={toggleHeight}
        >
          more...
        </button>
      </Col>
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
  className: PropTypes.string,
}

export default Issue
