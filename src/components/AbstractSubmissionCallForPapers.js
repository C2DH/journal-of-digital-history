import React from 'react'
import { useGetJSON } from '../logic/api/fetchData'
import { Row, Col } from 'react-bootstrap'
import LangLink from './LangLink'
import { StatusSuccess, BootstrapColumLayout } from '../constants'
import '../styles/components/AbstractSubmissionCallForPapers.scss'

const AbstractSubmissionCallForPapers = ({
  // cfp is a vaild slug identifier, tested on logic/params.js
  cfp = '',
}) => {
  const url = cfp.length
    ? `${process.env.REACT_APP_NOTEBOOK_CFP_BASE_URL}/${cfp}/${cfp}.ipynb`
    : null
  const { data, error, status } = useGetJSON({
    url, // if url is null, no call will ever be made
    delay: 0,
    raw: true,
  })
  console.debug('[AbstractSubmissionCallForPapers] url:', url, data, error, status)
  if (!url) {
    return null
  }
  if (error) {
    console.error(error)
    return null
  }
  return (
    <Row className="AbstractSubmissionCallForPapers">
      <Col {...BootstrapColumLayout}>
        <div className="AbstractSubmissionCallForPapers_reel">
          {status === StatusSuccess ? (
            <div className="AbstractSubmissionCallForPapers_cfp">
              <h3>
                Call for papers: <LangLink to={`cfp/${cfp}`}>{data.metadata.title}</LangLink>
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
            <p>{status}</p>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default React.memo(AbstractSubmissionCallForPapers, (prevProps, nextProps) => {
  return prevProps.url === nextProps.url
})
