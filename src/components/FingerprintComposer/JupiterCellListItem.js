import React, { useState } from 'react'
import Jupitercell from './Jupitercell'

const JupiterCellListItem = ({ children }) => {
  const [isNarrative, setisNarrative] = useState(false);
  const [isHermeneutics, setisHermeneutics] = useState(false);
  const [isData, setisData] = useState(false);
  return (
    <div className="JupiterCellListItem">
      <Jupitercell
        isNarative={isNarrative}
        isHermeneutics={isHermeneutics}
        isData={isData}
      >
        {children}
      </Jupitercell>
      <button onClick={() => setisNarrative(!isNarrative)}> Narrative </button>
      <button onClick={() => setisHermeneutics(!isHermeneutics)}>
        {" "}
        Hermeneutics{" "}
      </button>
      <button onClick={() => setisData(!isData)}> Data </button>
    </div>
  );
}


export default JupiterCellListItem
