import React from 'react'
import { Container, Row } from 'react-bootstrap'


const MiniJupitercell = ({
  isNarative = false,
  isHermeneutics = false,
  isData = false,
  children
  }) => {
  let divClassName = "Jupitercell";
  if (isNarative === true) {
    divClassName = "Jupitercell Narative";
  } else if (isHermeneutics === true) {
    divClassName = "Jupitercell Hermeneutics";
  } else if (isData === true) {
    divClassName = "Jupitercell Data";
  }
  return (
    <Container>
    <Row>
      <div className={divClassName}>
        {isNarative === true ? ("" ) : null}
        {isHermeneutics ? ( "" ) : null}
        {isData ? ("") : null}
        <p>{children}</p>
      </div>
      </Row>
    </Container>
  );
}

export default MiniJupitercell
