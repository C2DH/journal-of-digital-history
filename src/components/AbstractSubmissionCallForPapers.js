import React from 'react'
import { useGetJSON } from '../logic/api/fetchData'
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap'
import LangLink from './LangLink'
import { StatusSuccess, BootstrapColumLayout } from '../constants'
import '../styles/components/AbstractSubmissionCallForPapers.scss'
import { useTranslation } from 'react-i18next'

const AbstractSubmissionCallForPapers = ({
  // cfp is a vaild slug identifier, tested on logic/params.js
  cfp = '',
  // function to update current CFP
  onChange,
}) => {
  const { t } = useTranslation()
  const url = cfp.length
    ? `${process.env.REACT_APP_NOTEBOOK_CFP_BASE_URL}/${cfp}/${cfp}.ipynb`
    : null
  const { data, error, status } = useGetJSON({
    url, // if url is null, no call will ever be made
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

  console.debug(
    '[AbstractSubmissionCallForPapers] url:',
    url,
    data,
    error,
    status
  )
  console.debug(
    '[AbstractSubmissionCallForPapers] url:',
    '/api/callofpaper',
    listOfCfps,
    errorListOfCfps,
    statusListofCfps
  )
  const dropdownButtonTitle = cfp.length
    ? status === StatusSuccess
      ? data.metadata.title
      : t('loading')
    : t('openCallForPapers')

  return (
    <Row className='AbstractSubmissionCallForPapers'>
      <Col {...BootstrapColumLayout}>
        <div className='mb-3'>
          <label
            dangerouslySetInnerHTML={{ __html: t('selectCallForPapers') }}
          />
          <DropdownButton
            disabled={statusListofCfps !== StatusSuccess}
            id='dropdown-basic-button'
            onChange={onChange}
            title={dropdownButtonTitle}
            variant='outline-accent'
            size='sm'
          >
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
            <Dropdown.Item
              active={cfp === ''}
              onClick={() => onChange(undefined)}
            >
              <span>{t('openCallForPapers')}</span>
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {cfp.length > 0 && (
          <div className='AbstractSubmissionCallForPapers_reel'>
            {status === StatusSuccess ? (
              <div className='AbstractSubmissionCallForPapers_cfp'>
                <h3>
                  Call for papers:&nbsp;
                  <LangLink to={`cfp/${cfp}`}>{data.metadata.title}</LangLink>
                </h3>
                <div className='border-top border-accent pt-2'>
                  <label>
                    {data.metadata.jdh.helmet['twitter:label1']}:&nbsp;
                  </label>
                  {data.metadata.jdh.helmet['twitter:data1']}
                  <br />
                  <label>
                    {data.metadata.jdh.helmet['twitter:label2']}: &nbsp;
                  </label>
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

export default React.memo(
  AbstractSubmissionCallForPapers,
  (prevProps, nextProps) => {
    return prevProps.cfp === nextProps.cfp
  }
)
