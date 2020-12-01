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
  showPreviewSwitch
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
    <div className="border border-dark p-3">
      <h3>{t('pages.abstractSubmission.preview')}</h3>
      <p>{isEmpty && (<>
          <Badge variant="info" pill>{t('badge.warning')}</Badge>&nbsp;
          {t('labels.formSubmissionIncomplete')}
      </>)}
      {!isEmpty && !validatorResult.valid && (<>
            <Badge variant="warning" pill>{t('badge.danger')}</Badge>&nbsp;
            <span dangerouslySetInnerHTML={{
              __html: t('missingStepsWithCount', { count: validatorResult.errors.length})
            }} />
      </>)}
      {validatorResult.valid && (
        <>
          <Badge variant="success" pill>{t('badge.success')}</Badge>&nbsp;
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
        <blockquote className="border-left border-dark mt-2 pl-2" key={i}>
          <FormJSONSchemaErrorListItem error={error} />
        </blockquote>
      ))}
      </div>
      <br/>
      <Badge variant='info'>{t('labels.dateCreated')}</Badge>&nbsp;
      {t('dates.LLL', {date: temporaryAbstractSubmission.getDateCreated()})}
      <br/>
      <Badge variant='info'>{t('labels.dateLastModified')}</Badge>&nbsp;
      <span> ({t('dates.fromNow', {date: temporaryAbstractSubmission.getDateLastModified()})})</span>
      <br/>
      <div className="my-3">
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

      <Button variant="outline-dark"
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
