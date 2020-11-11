import React from 'react'
import { Badge, Button, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import AbstractSubmission from '../models/AbstractSubmission'

const AbstractSubmissionPreview = ({
  results,
  submission,
  onChangeMode,
  isPreviewMode
}) => {
  const { t } = useTranslation()
  const temporaryAbstractSubmission = submission instanceof AbstractSubmission
    ? submission
    : new AbstractSubmission(submission)
  
  const downloadableSubmissionFilename = [
    (new Date()).toISOString().split('T').shift(),
    'submission.json'
  ].join('-')
  return (
    <div className="p-3 border-dark">
      <h3>{t('pages.abstractSubmission.preview')}</h3>
      <div  style={{
        maxHeight: '50vh',
        overflow: 'scroll'
      }}>
      {results.map(({ value, isValid, label }, i) => (
        <div key={`result-${i}`} >
          <Badge variant={ isValid ? 'success': 'transparent' } pill>
            {value === null && ' (empty)'}
            {isValid === 'false' && ' (error)'}
          </Badge>{t(label)}
        </div>
      ))}
      </div>
      <br/>
      <Badge variant='transparent'>edited</Badge>&nbsp;
      {t('dates.LLL', {date: temporaryAbstractSubmission.getDateLastModified()})}
      <br/>
      <div class="ml-2">({t('dates.fromNow', {date: temporaryAbstractSubmission.getDateLastModified()})})</div>
      <div>
      <ButtonGroup size="sm" className="my-3">
        <Button variant="outline-dark"
          onClick={() => onChangeMode(false)}
          className={isPreviewMode ? null : 'active'}
        >✎ edit</Button>
        <Button variant="outline-dark"
          onClick={() => onChangeMode(true)}
          className={isPreviewMode ? 'active' : null}
        >preview ⚆</Button>
      </ButtonGroup>
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