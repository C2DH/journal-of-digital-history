import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { Code } from 'react-feather'
import { useTranslation } from 'react-i18next'
import GithubLogo from '../../assets/images/github.ico'
import BinderLogo from '../../assets/images/mybinder.ico'
import DataverseLogo from '../../assets/images/dataverse.ico'

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
            <b>{t('actions.playWithArticle')}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {[
              { url: binderUrl, key: 'Binder', img: BinderLogo },
              { url: repositoryUrl, key: 'Repository', img: GithubLogo },
              { url: dataverseUrl, key: 'Dataverse', img: DataverseLogo },
            ]
              .filter((d) => typeof d.url === 'string' && d.url.length > 0)
              .map((d, i) => (
                <Row key={i} className="my-3 ">
                  <Col
                    sm={{ span: 7 }}
                    className="small ps-0"
                    dangerouslySetInnerHTML={{ __html: t(`openNotebookIn${d.key}Label`) }}
                  />
                  <Col className="text-end">
                    <a
                      href={d.url}
                      rel="noreferrer"
                      target="_blank"
                      className="btn btn-sm btn-outline-dark px-1 py-0 d-flex-inline align-items-center"
                    >
                      <img style={{ height: 15 }} src={d.img} />
                      <span className="ms-2">{t(`openNotebookIn${d.key}Button`)}</span>
                    </a>
                  </Col>
                </Row>
              ))}
          </Container>
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
