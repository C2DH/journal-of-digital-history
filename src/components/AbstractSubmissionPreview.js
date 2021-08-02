import React from 'react'
import { Badge, Button, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import AbstractSubmission from '../models/AbstractSubmission'
import FormJSONSchemaErrorListItem from './Forms/FormJSONSchemaErrorListItem'


const AbstractSubmissionPreview = ({
  validatorResult,
  submission,
  onChangeMode,
  isPreviewMode,
  showPreviewSwitch,
  onReset,
}) => {
  const { t } = useTranslation()

  const temporaryAbstractSubmission = submission instanceof AbstractSubmission
    ? submission
    : new AbstractSubmission(submission)

  // const checkList = (validatorResult.errors ?? []).map((d) => ({
  //   path: d.path[0],
  //   message: d.message,
  // }))
  console.info('AbstractSubmissionPreview rendering, result:', validatorResult)

  const isEmpty = temporaryAbstractSubmission.isEmpty()

  const downloadableSubmissionFilename = [
    (new Date()).toISOString().split('T').shift(),
    'submission.json'
  ].join('-')

  return (
    <div className="p-3 shadow-sm rounded" style={{
      border: '1px solid var(--gray-300)'
    }}>
      <h3>{t('pages.abstractSubmission.preview')}</h3>
      <p>{isEmpty && (<>
          <Badge bg="info" pill>{t('badge.warning')}</Badge>&nbsp;
          {t('labels.formSubmissionIncomplete')}
      </>)}
      {!isEmpty && !validatorResult.valid && (<>
            <Badge bg="warning" pill>{t('badge.danger')}</Badge>&nbsp;
            <span dangerouslySetInnerHTML={{
              __html: t('missingStepsWithCount', { count: validatorResult.errors.length})
            }} />
      </>)}
      {validatorResult.valid && (
        <>
          <Badge bg="success" pill>{t('badge.success')}</Badge>&nbsp;
          <span dangerouslySetInnerHTML={{
            __html: t('labels.formSubmissionReady')
          }} />
        </>
      )}
      </p>
      <div className="p-1" style={{
        backgroundColor: 'var(--gray-100)',
        maxHeight: '50vh',
        overflow: 'scroll'
      }}>
      {!isEmpty && validatorResult?.errors.map((error, i) => (
        <blockquote className="border-left border-dark mt-2 ps-2" key={i}>
          <FormJSONSchemaErrorListItem error={error} />
        </blockquote>
      ))}
      </div>
      <br/>
      <Badge bg='info'>{t('labels.dateCreated')}</Badge>&nbsp;
      {t('dates.LLL', {date: temporaryAbstractSubmission.getDateCreated()})}
      <br/>
      <Badge bg='info'>{t('labels.dateLastModified')}</Badge>&nbsp;
      <span> ({t('dates.fromNow', {date: temporaryAbstractSubmission.getDateLastModified()})})</span>
      <br/>
      <div className="my-3 d-grid gap-2">
      <Button variant="outline-danger"
        size="sm"
        onClick={onReset}
      >
        {t('actions.resetForm')}
      </Button>
      {showPreviewSwitch && <ButtonGroup size="sm" >
        <Button variant="outline-dark"
          onClick={() => onChangeMode(false)}
          className={isPreviewMode ? null : 'active'}
        >✎ edit</Button>
        <Button variant="outline-dark"
          onClick={() => onChangeMode(true)}
          className={isPreviewMode ? 'active' : null}
        >preview ⚆</Button>
      </ButtonGroup>}
      </div>

      <Button className="d-block" variant="outline-dark"
        size="sm"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(temporaryAbstractSubmission, null, 2)
        )}`}
        download={downloadableSubmissionFilename}
      >
        {t('actions.downloadAsJSON')} ↓
      </Button>
    </div>
  )
}

export default AbstractSubmissionPreview
