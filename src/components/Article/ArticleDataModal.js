import React from 'react'
import { Modal } from 'react-bootstrap'
import { Code, GitHub } from 'react-feather'
import { useTranslation } from 'react-i18next'

const ArticleDataModal = ({ binderUrl, repositoryUrl, dataverseUrl }) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = React.useState(false)
  // const handleClose = () => setIsVisible(false)
  return (
    <>
      {/* trigger button */}
      <button className="btn btn-outline-accent btn-sm" onClick={() => setIsVisible(true)}>
        <Code size={13} />
        <span className="ms-2">{t('actions.playWithArticle')}</span>
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
          <Modal.Title id="article-data-modal-title-vcenter">
            {t('actions.playWithArticle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {typeof binderUrl === 'string' && binderUrl.length > 0 ? (
              <a href={binderUrl} className="btn btn-sm btn-dark-outline">
                <GitHub size={12} className="me-2" />
                <span className="ms-2">Open in Binder</span>
              </a>
            ) : null}
          </p>

          <p>
            {typeof repositoryUrl === 'string' && repositoryUrl.length > 0 ? (
              <a href={repositoryUrl} className="btn btn-sm btn-dark-outline">
                <GitHub size={12} className="me-2" />
                <span className="ms-2">Open in GitHub</span>
              </a>
            ) : null}
          </p>

          <p>
            {typeof dataverseUrl === 'string' && dataverseUrl.length > 0 ? (
              <a href={repositoryUrl} className="btn btn-sm btn-dark-outline">
                <GitHub size={12} className="me-2" />
                <span className="ms-2">browse the dataset in Dataverse </span>
              </a>
            ) : (
              <span className="text-muted">Dataverse not available</span>
            )}
          </p>
        </Modal.Body>

        {/* <Modal.Footer>
          <button className="btn btn-sm btn-secondary" onClick={handleClose}>
            Close plugin
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  )
}

export default ArticleDataModal
