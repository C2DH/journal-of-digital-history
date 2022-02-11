import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'
import JupiterCellListItem from '../components/FingerprintComposer/JupiterCellListItem'
import MiniJupiterCellListItem from '../components/FingerprintComposer/MiniJupiterCellListItem'
import '../styles/components/FingerprintComposer/FingerprintComposer.scss'
import ArticleFingerprint from '../components/Article/ArticleFingerprint'
import ArticleFingerprintTooltip from '../components/ArticleV2/ArticleFingerprintTooltip'
import { useBoundingClientRect } from '../hooks/graphics'
import { useSpring, config } from 'react-spring'


const FingerprintExplained = () => {
  const [{ width:size }, ref] = useBoundingClientRect()
  const [cells, setCells] = useState([
    {
      content: "This is a Narative layer"
    },
    {
      content: "This is not a Narative layer"
    },
    {
      hermeneutics: true,
      content: "This is an Hermeneutics layer"
    },
    {
      data: true,
      content: "This is a data layer"
    },
  ]);
  const [value, setValue] = useState("");

  // animated Ref contains the info to display on the tooltip
  const animatedRef = useRef({ idx: '', length: '', datum:{}});
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    from: { x: 0, y: 0, id: [0, 0], color: 'red' },
    x : 0, y: 0, opacity:0, id: [0, 0],
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff
  }))

  const onMouseMoveHandler = (e, datum, idx) => {
    // console.debug('@onMouseMoveHandler', datum, idx)
    animatedRef.current.idx = idx
    animatedRef.current.length = cells.length
    animatedRef.current.datum = datum
    // this will change only animated toltip stuff
    setAnimatedProps.start({
      x: e.clientX - 200,
      y: e.clientY + 50,
      id: [idx],
      opacity: 1
    })
  }

  const onChangeHandler=(idx, cell) => {
    console.info ("Changed to:", idx, cell)
    setCells(cells.map((d, i) => {
      if (i === idx) {
        return { ...d, ...cell }
      }
      return d
    }))
  }

  return (
    <>
    <ArticleFingerprintTooltip
      forwardedRef={animatedRef}
      animatedProps={animatedProps} />
    <Container className="FingerprintExplained page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Fingerprint, explained</h1>
          <p> This would be a paragraph explaining the concept behind the Markdown cell language Fusce turpis tortor, efficitur et turpis a, congue sagittis elit. Nullam quis metus tortor. Vivamus ut porta dolor. Vestibulum malesuada neque at turpis tincidunt, in sagittis neque semper. Suspendisse posuere ornare lacus vel placerat. Cras lobortis luctus feugiat. Donec interdum est non lectus vehicula pharetra. Sed convallis dui quam, a elementum tortor pharetra id. Vivamus vel fermentum odio. In commodo ipsum pulvinar quam faucibus, sed rhoncus ligula faucibus. Proin bibendum non ipsum in bibendum. Nam sit amet lacus lectus. Integer vitae tellus sit amet felis efficitur maximus. Etiam iaculis ultricies leo, sit amet varius neque euismod in. </p>
        </Col>
      </Row>
      <Row style={{
        minHeight: size*2.5
      }}>
      <Col>
          <h2 className="my-5">The Cell</h2>
          {cells.map((d,i) => {
            return (
              <JupiterCellListItem
                key={i}
                narrative={d.narrative}
                hermeneutics={d.hermeneutics}
                data={d.data}
                onChange={(cell) => onChangeHandler(i, cell)}
              >

                {d.content}
              </JupiterCellListItem>
            )
          })}
          <Container className="AddNewCell">
          <Row>
          <hr className="mt-3 mb-3"/>
              <label className="form-label"> Experiment with the fingerprint visualization by adding more cells </label>
              <textarea className="form-control-fp"
                onChange={(e) => setValue(e.target.value)}
                type="textarea"
                id="name"
                name="name"
                rows={3}
                placeholder="In commodo ipsum pulvinar quam faucibus, sed rhoncus ligula faucibus. Proin bibendum non ipsum in bibendum. Nam sit amet lacus lectus. "
                required
              />
              <Button className="JupitercellAddButton" variant="outline-dark" size="sm" onClick={() => setCells(cells.concat([
                {
                  hermeneutics: false,
                  content: value
                },
              ]))}>
                add new cell
              </Button>
              </Row>
          </Container>
        </Col>
        <Col>
          <div ref={ref}
            style={{
              minHeight: size,
              position: "sticky",
              top: 100
            }}
            onMouseOut={() => setAnimatedProps.start({ opacity: 0 })}
          >
          <ArticleFingerprint
            onMouseMove={onMouseMoveHandler}
            debug={true}
            stats={{
              extentChars: [5, 440]
            }}
            cells={cells.map((cell) => ({
              ...cell,
              type: cell.data ? 'code': 'markdown',
              isHermeneutic: cell.hermeneutics,
              countChars: cell.content.length
            }))}
            size={size}
            margin={20}
          />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
        </Col>
      </Row>

      <Row style={{
        minHeight: size*3
      }}>
      <Col>
        <div ref={ref} style={{
          minHeight: size,
          position: "sticky",
          top: 100
        }}>
        <ArticleFingerprint
          debug={true}
          stats={{
            extentChars: [5, 440]
          }}
          cells={cells.map((cell) => ({
            ...cell,
            type: cell.data ? 'code': 'markdown',
            isHermeneutic: cell.hermeneutics,
            countChars: cell.content.length
          }))}
          size={size}
          margin={20}
        />
        </div>
      </Col>
        <Col>
          <h2 className="my-5">The Fingerprint</h2>
          <p> This would be a paragraph explaining the concept behind the Markdown cell language Fusce turpis tortor, efficitur et turpis a, congue sagittis elit. Nullam quis metus tortor. Vivamus ut porta dolor. Vestibulum malesuada neque at turpis tincidunt, in sagittis neque semper. Suspendisse posuere ornare lacus vel placerat. Cras lobortis luctus feugiat. Donec interdum est non lectus vehicula pharetra. Sed convallis dui quam, a elementum tortor pharetra id. Vivamus vel fermentum odio. In commodo ipsum pulvinar quam faucibus, sed rhoncus ligula faucibus. Proin bibendum non ipsum in bibendum. Nam sit amet lacus lectus. Integer vitae tellus sit amet felis efficitur maximus. Etiam iaculis ultricies leo, sit amet varius neque euismod in. </p>

            {cells.map((d,i) => {
              return (
                <MiniJupiterCellListItem
                key={i}
                narrative={d.narrative}
                hermeneutics={d.hermeneutics}
                data={d.data}
                onChange={(cell) => onChangeHandler(i, cell)}
                >
                {d.content}
                </MiniJupiterCellListItem>
              )
            })}
        </Col>
      </Row>

    </Container>
    </>
  )
}

export default FingerprintExplained
