import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const AbstractSubmissionModal = ({ show, onHide, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('pages.abstractSubmission.confirmSubmissionTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('pages.abstractSubmission.confirmSubmissionMessage')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('actions.cancel')}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {t('actions.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AbstractSubmissionModal