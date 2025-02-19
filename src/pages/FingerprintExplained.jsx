import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Aperture } from 'react-feather'
import MarkdownIt from 'markdown-it'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { BootstrapFullColumLayout, StatusSuccess, StatusError } from '../constants'
import JupyterCell from '../components/FingerprintExplained/JupyterCell'
import '../styles/components/FingerprintComposer/FingerprintComposer.scss'
import ArticleFingerprint from '../components/Article/ArticleFingerprint'
import ArticleFingerprintTooltip from '../components/ArticleV2/ArticleFingerprintTooltip'
import { parseNotebook } from '../logic/fingerprint'
import { useGetJSON } from '../logic/api/fetchData'
import { useBoundingClientRect } from '../hooks/graphics'
import { useSpring, config } from 'react-spring'
import StaticPageLoader from './StaticPageLoader'
import { decodeNotebookUrl, encodeNotebookUrl, getRawNotebookUrl } from '../logic/notebook'
import { useHistory } from 'react-router'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

/**
 * Get currrent EcodedUrl param from current route
 * @returns Component with fingerprint explained
 */
const FingerprintExplained = ({
  match: {
    params: { encodedUrl = '' },
  },
}) => {
  const { t } = useTranslation()
  const notebookUrl = encodedUrl.length
    ? decodeNotebookUrl(encodedUrl)
    : import.meta.env.VITE_NOTEBOOK_FINGERPRINT_EXPLAINED_URL

  return (
    <>
      <Container className="FingerprintExplained page">
        <Row>
          <Col {...BootstrapFullColumLayout}>
            <h1
              className="mt-5 mb-0"
              dangerouslySetInnerHTML={{
                __html: t('pages.fingerprintExplained.title'),
              }}
            />
          </Col>
        </Row>
      </Container>
      <StaticPageLoader
        url={import.meta.env.VITE_WIKI_FINGERPRINT_EXPLAINED}
        raw
        fakeData=""
        delay={0}
        Component={({ data = '', status }) => (
          <div style={{ minHeight: '100vh' }}>
            <Container>
              <Row>
                <Col
                  {...BootstrapFullColumLayout}
                  dangerouslySetInnerHTML={{
                    __html: status === StatusSuccess ? markdownParser.render(data) : '',
                  }}
                />
              </Row>
            </Container>
            <FingerprintExplainedContents notebookUrl={notebookUrl} status={status} />
          </div>
        )}
      />
    </>
  )
}

const FingerprintExplainedContents = ({ status: contentsStatus, notebookUrl = '' }) => {
  const [{ width: size }, ref] = useBoundingClientRect()
  const history = useHistory()
  const { t, i18n } = useTranslation()
  // original notebook cells
  const [notebookCells, setNotebookCells] = useState([])
  const [parsedCells, setParsedCells] = useState([])
  const [parsedStats, setParsedStats] = useState({})

  const rawNotebookUrl = getRawNotebookUrl(notebookUrl)
  console.debug(
    '[FingerprintExplainedContents] \n - notebookUrl',
    notebookUrl,
    '\n - rawNotebookUrl',
    rawNotebookUrl,
  )
  const { data, status } = useGetJSON({
    url: contentsStatus === StatusSuccess ? rawNotebookUrl : null,
    delay: 1000,
  })

  // animated Ref contains the info to display on the tooltip
  const animatedRef = useRef({ idx: '', length: '', datum: {} })
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    from: { x: 0, y: 0, id: [0, 0], color: 'red' },
    x: 0,
    y: 0,
    opacity: 0,
    id: [0, 0],
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff,
  }))

  const onSubmitHandler = (e) => {
    const lang = i18n.language.split('-')[0]
    // setSubmitedNotebookUrl(notebookUrl)
    console.info('@submit', e.target.url.value)
    history.push(`/${lang}/fingerprint-explained/${encodeNotebookUrl(e.target.url.value)}`)
    e.preventDefault()
  }

  const onMouseMoveHandler = (e, datum, idx) => {
    // console.debug('@onMouseMoveHandler', datum, idx)
    animatedRef.current.idx = idx
    animatedRef.current.length = notebookCells.length
    animatedRef.current.datum = datum
    // this will change only animated toltip stuff
    setAnimatedProps.start({
      x: e.clientX - 200,
      y: e.clientY + 50,
      id: [idx],
      opacity: 1,
    })
  }

  const onCellMouseEnterHandler = (e, idx) => {
    console.debug('[FingerprintExplained] @onCellMouseEnterHandler:', idx)
    if (!ref.current || !parsedCells.length || !parsedCells[idx]) {
      return
    }
    animatedRef.current.idx = idx
    animatedRef.current.length = notebookCells.length
    animatedRef.current.datum = parsedCells[idx]
    const { left, top } = ref.current.getBoundingClientRect()
    const angleD = (Math.PI * 2) / (notebookCells.length + 1)
    const theta = idx * angleD - Math.PI / 2
    setAnimatedProps.start({
      opacity: 1,
      id: [idx],
      x: Math.min(left + size / 4, left + Math.cos(theta) * (size / 2)),
      y: top + size / 2 + Math.sin(theta) * (size / 2),
    })
  }
  const onChangeHandler = (idx, cell) => {
    const updatedNotebookCells = notebookCells.map((d, i) => {
      if (i === idx) {
        return cell
      }
      return d
    })

    const fingerprintData = parseNotebook({ cells: updatedNotebookCells })
    setNotebookCells(updatedNotebookCells)
    setParsedCells(fingerprintData.cells)
    setParsedStats(fingerprintData.stats)
    console.debug('[FingerprintExplained] @onChange:', idx, cell, fingerprintData.cells[idx])
    // if()
    // animatedRef.current.idx = idx
    // animatedRef.current.length = updatedNotebookCells.length
    // animatedRef.current.datum = fingerprintData.cells[idx]
    // setAnimatedProps.start({
    //   opacity: 1,
    //   id: [idx],
    // })
  }

  const onNewCellClickHandler = () => {
    const updatedNotebookCells = notebookCells.concat([
      {
        cell_type: 'code',
        source: [],
        metadata: {
          tags: [],
        },
      },
    ])
    const fingerprintData = parseNotebook({ cells: updatedNotebookCells })
    setNotebookCells(updatedNotebookCells)
    setParsedCells(fingerprintData.cells)
    setParsedStats(fingerprintData.stats)
  }

  useEffect(() => {
    if (status === StatusSuccess) {
      const cells = data.cells.map((c) => {
        // lighter version of cell, remove OUTPUTS!
        return {
          cell_type: c.cell_type,
          source: c.source,
          metadata: c.metadata,
        }
      })
      const fingerprintData = parseNotebook({ cells })
      console.info('[FingerprintExplained] @useEffect StatusSuccess, notebook loaded.')
      setNotebookCells(cells)
      setParsedCells(fingerprintData.cells)
      setParsedStats(fingerprintData.stats)
    }
  }, [notebookUrl, status])

  console.info('[FingerprintExplained] RENDERED')

  return (
    <>
      <ArticleFingerprintTooltip forwardedRef={animatedRef} animatedProps={animatedProps} />

      <Container>
        <Row
          style={{
            minHeight: size * 2.5,
          }}
        >
          <Col md={{ span: 7 }}>
            <Form className="shadow p-3" onSubmit={onSubmitHandler}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>{t('pages.fingerprintExplained.formLabel')}</Form.Label>
                <Form.Control
                  name="url"
                  defaultValue={notebookUrl}
                  type="url"
                  placeholder="https://"
                />
                {status === StatusError && <p> There's an error </p>}
                <Form.Text
                  className="text-muted"
                  dangerouslySetInnerHTML={{
                    __html:
                      'Use a well formed URL pointing to the <code>.ipynb</code> notebook file. For instance use to the <b>raw</b> url of the ipynb file for notebook hosted on Github.',
                  }}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="secondary"
                style={{
                  borderRadius: '5px',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                }}
              >
                <span className="me-2">{t('FormNotebookUrl_PreviewFingerprint')}</span>
                <Aperture size="16" />
              </Button>
            </Form>

            {notebookCells.map((cell, i) => {
              return (
                <JupyterCell
                  key={i}
                  className="my-3"
                  cell={cell}
                  idx={i}
                  parsedCell={parsedCells[i]}
                  onMouseEnter={onCellMouseEnterHandler}
                  onMouseLeave={() => setAnimatedProps.start({ opacity: 0 })}
                  onChange={(changedCell) => onChangeHandler(i, changedCell)}
                  num={`${i + 1}/${notebookCells.length}`}
                />
                // <JupiterCellListItem
                //   key={i}
                //   num={`${i+1} / ${cells.length}`}
                //   initial={d}
                //   type={d.code}
                //   isHermeneutic={d.isHermeneutic}
                //   isHeading={d.isHeading}
                //   data={d.data}
                //   onChange={(cell) => onChangeHandler(i, cell)}
                // >
                //   {d.firstWords}
                // </JupiterCellListItem>
              )
            })}

            <Button
              className="JupitercellAddButton"
              variant="outline-dark"
              size="sm"
              onClick={onNewCellClickHandler}
            >
              add new cell
            </Button>
          </Col>
          <Col>
            <div
              ref={ref}
              style={{
                minHeight: size,
                position: 'sticky',
                top: 100,
              }}
              onMouseOut={() => setAnimatedProps.start({ opacity: 0 })}
            >
              <ArticleFingerprint
                onMouseMove={onMouseMoveHandler}
                debug={true}
                stats={parsedStats}
                cells={parsedCells}
                size={size}
                margin={20}
              />
              <div
                className="position-absolute"
                style={{
                  top: size,
                }}
                dangerouslySetInnerHTML={{
                  __html: t('pages.fingerprintExplained.legend', {
                    count: parsedCells.length,
                    countHermeneutics: parsedCells.filter((d) => d.isHermeneutic).length,
                    countData: parsedCells.filter((d) => d.type === 'code').length,
                  }),
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Container>
    </>
  )
}

export default FingerprintExplained
