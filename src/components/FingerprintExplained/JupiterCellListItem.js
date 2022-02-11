import React, { useState } from 'react'
import Jupitercell from './Jupitercell'
import { Container, Row, Button } from 'react-bootstrap'


const JupiterCellListItem = ({ children }) => {
  const [isNarrative, setisNarrative] = useState(false);
  const [isHermeneutics, setisHermeneutics] = useState(false);
  const [isData, setisData] = useState(false);
  return (
    <Container>
    <Row className="JupiterCellListItem">
      <Jupitercell
        isNarative={isNarrative}
        isHermeneutics={isHermeneutics}
        isData={isData}
      >
        {children}
      </Jupitercell>
      <Button variant="outline-dark" size="sm" onClick={() => setisNarrative(!isNarrative)}> Narrative </Button>
      <Button variant="outline-dark" size="sm" onClick={() => setisHermeneutics(!isHermeneutics)}>
        Hermeneutics
      </Button>
      <Button variant="primary" size="sm" onClick={() => setisData(!isData)}> Data </Button>
    </Row>
    </Container>
  );
}


export default JupiterCellListItem
