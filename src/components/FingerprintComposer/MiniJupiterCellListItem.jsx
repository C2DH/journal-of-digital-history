import React, { useState } from 'react'
import MiniJupitercell from './MiniJupitercell'
import { Col, Row, Button, ButtonGroup } from 'react-bootstrap'


const MiniJupiterCellListItem = ({
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
    <Row className="MiniJupiterCellListItem">
    <Col className="d-none">
    <ButtonGroup aria-lable="toggle">
      <Button variant="outline-dark" size="sm" onClick={() => onClickHandler({hermeneutics:!tags.hermeneutics})}>
        Hermeneutics
      </Button>
      <Button variant="outline-dark" size="sm" onClick={() => onClickHandler({data:!tags.data})}> Data </Button>
    </ButtonGroup>
    </Col>
    <Col sm={8}>
      <MiniJupitercell
        isHermeneutics={tags.hermeneutics}
        isData={tags.data}
      >
        {children}
      </MiniJupitercell>
      </Col>
    </Row>
  );
}


export default MiniJupiterCellListItem
