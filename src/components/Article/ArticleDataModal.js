import React from 'react'
import { Modal } from 'react-bootstrap'
import { Code, GitHub } from 'react-feather'
import { useTranslation } from 'react-i18next'

const ArticleDataModal = ({ url = '' }) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = React.useState(false)
  const handleClose = () => setIsVisible(false)
  return (
    <>
      {/* trigger button */}
      <button className="btn btn-actions btn-sm" onClick={() => setIsVisible(true)}>
        <Code size={13} />
        <span className="ms-2">{t('playWithCode')}</span>
      </button>
      <Modal
        animation={false}
        backdrop="static"
        slize="lg"
        aria-labelledby="article-data-modal-title-vcenter"
        className="shadow"
        centered
        show={isVisible}
        onHide={() => setIsVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="article-data-modal-title-vcenter">Play with data!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>play online</h4>
          <p>
            blab labllblalb{' '}
            <a href="github.com" className="btn btn-sm btn-dark-outline">
              {' '}
              <GitHub size={12} className="me-2" />
              gihtub {url}
            </a>
          </p>
          <h4>have a look at the dataset</h4>
          <p>blab labllblalb</p>
          <h4>play online</h4>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-sm btn-secondary" onClick={handleClose}>
            Close plugin
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ArticleDataModal
