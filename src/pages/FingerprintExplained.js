import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'
import JupiterCellListItem from '../components/FingerprintComposer/JupiterCellListItem'
import '../styles/components/FingerprintComposer/FingerprintComposer.scss'

const FingerprintExplained = () => {
  const [cells, setCells] = useState(["Title of Article"]);
  const [value, setValue] = useState("");
  return (
    <Container className="FingerprintExplained page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Fingerprint, explained</h1>
        </Col>
      </Row>
      <Row>
      <Col>
          {cells.map((d,i) => {
            return <JupiterCellListItem key={i}> {d} </JupiterCellListItem>;
          })}
          <input
            onChange={(e) => setValue(e.target.value)}
            type="text"
            id="name"
            name="name"
            required
          />
          <button onClick={() => setCells(cells.concat([value]))}>
            add new cell
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default FingerprintExplained
