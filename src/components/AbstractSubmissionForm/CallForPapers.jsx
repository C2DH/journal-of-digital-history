import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap'

import { useGetJSON } from '../../logic/api/fetchData'
import LangLink from '../LangLink'
import { StatusSuccess } from '../../constants/globalConstants'

import '../../styles/components/AbstractSubmissionForm/CallForPapers.scss'

const AbstractSubmissionCallForPapers = ({ cfp = '', onChange }) => {
  const { t } = useTranslation()
  const url =
    cfp && cfp !== 'openSubmission'
      ? `${import.meta.env.VITE_NOTEBOOK_CFP_BASE_URL}/${cfp}/${cfp}.ipynb`
      : null
  const { data, error, status } = useGetJSON({
    url, // No call will be made if url is null
    delay: 0,
    raw: true,
  })

  const {
    data: listOfCfps,
    error: errorListOfCfps,
    status: statusListofCfps,
  } = useGetJSON({
    url: '/api/callofpaper',
    delay: 100,
  })

  console.debug('[AbstractSubmissionCallForPapers] url:', url, data, error, status)
  console.debug(
    '[AbstractSubmissionCallForPapers] url:',
    '/api/callofpaper',
    listOfCfps,
    errorListOfCfps,
    statusListofCfps,
  )

  const dropdownButtonTitle =
    cfp === 'openSubmission'
      ? t('openSubmission')
      : cfp.length
      ? statusListofCfps === StatusSuccess
        ? listOfCfps.results.find((item) => item.folder_name === cfp)?.title || t('loading')
        : t('loading')
      : t('selectCallForPapers')

  return (
    <Row className="AbstractSubmissionCallForPapers">
      <Col>
        <div className="dropdown-container d-flex align-items-center">
          <DropdownButton
            // disabled={statusListofCfps !== StatusSuccess}
            id="dropdown-basic-button"
            onChange={onChange}
            title={dropdownButtonTitle}
            variant="outline-accent"
            size="sm"
            data-test="form-select-callForPapers"
          >
            <Dropdown.Item
              className={`please-select ${cfp === '' ? 'disabled-option' : ''}`}
              active={cfp === ''}
              onClick={() => onChange('')}
            >
              <span>{t('selectCallForPapers')}</span>
            </Dropdown.Item>
            <Dropdown.Item
              className="open-submission"
              onClick={() => onChange('openSubmission')}
              data-test="form-select-callForPapers-openSubmission"
            >
              <span>{t('openSubmission')}</span>
            </Dropdown.Item>
            {statusListofCfps === StatusSuccess &&
              listOfCfps.results.map((item, i) => (
                <Dropdown.Item
                  key={i}
                  active={cfp === item.folder_name}
                  onClick={() => onChange(item.folder_name)}
                >
                  <span>{item.title}</span>
                </Dropdown.Item>
              ))}
          </DropdownButton>
          <span className="ms-2 text-accent">*</span>
        </div>
        <br />
        {cfp.length > 0 && cfp !== 'openSubmission' && (
          <div className="AbstractSubmissionCallForPapers_reel">
            {status === StatusSuccess ? (
              <div className="AbstractSubmissionCallForPapers_cfp">
                <h3>
                  Call for papers:&nbsp;
                  <LangLink to={`cfp/${cfp}`}>{dropdownButtonTitle}</LangLink>
                </h3>
                <div className="border-top border-accent pt-2">
                  <label>{data.metadata.jdh.helmet['twitter:label1']}:&nbsp;</label>
                  {data.metadata.jdh.helmet['twitter:data1']}
                  <br />
                  <label>{data.metadata.jdh.helmet['twitter:label2']}: &nbsp;</label>
                  {data.metadata.jdh.helmet['twitter:data2']}
                </div>
              </div>
            ) : (
              <p className={status}></p>
            )}
          </div>
        )}
      </Col>
    </Row>
  )
}

export default React.memo(AbstractSubmissionCallForPapers, (prevProps, nextProps) => {
  return prevProps.cfp === nextProps.cfp
})
