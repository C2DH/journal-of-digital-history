import React, { useState } from 'react'
import Jupitercell from './Jupitercell'
import { Container, Col, Row, ButtonGroup, Button } from 'react-bootstrap'


const JupiterCellListItem = ({
  children,
  hermeneutics=false,
  data=false,
  onChange
}) => {
  const [tags, set] = useState({
    hermeneutics,
    data
  })
  const onClickHandler=(t) => {
    const ts = {
      ...tags,
      ...t
    }
    set(ts)
    if (typeof onChange === 'function') {
      onChange(ts)
    }
  }
  return (
    <Container>
    <Row className="JupiterCellListItem">
    <Col>
    <ButtonGroup aria-lable="toggle">
    <Button variant="outline-dark" size="sm" onClick={() => onClickHandler({hermeneutics:!tags.hermeneutics})}>
      Hermeneutics
    </Button>
    <Button variant="outline-dark" size="sm" onClick={() => onClickHandler({data:!tags.data})}> Data </Button>
    </ButtonGroup>
    </Col>
    <Col md={8}>
      <Jupitercell
        isHermeneutics={tags.hermeneutics}
        isData={tags.data}
      >
        {children}
      </Jupitercell>
      </Col>
    </Row>
    </Container>
  );
}


export default JupiterCellListItem
