import React, { useState, useEffect } from 'react'
import Jupitercell from './Jupitercell'
import { Button } from 'react-bootstrap'

/**
 * Representation of a jupyter cell in the fingerprint vis
 */
const JupiterCellListItem = ({
  children,
  isHermeneutic=false,
  isHeading=false,
  type='markdown',
  num="1 / 1",
  initial={},
  debug=false,
  onChange
}) => {
  const [cell, set] = useState({
    isHermeneutic,
    isHeading,
    type,
    changed: false,
  })

  const onClickHandler=(t) => {
    const ts = {
      ...cell,
      ...t,
      changed: true
    }
    set(ts)
  }

  useEffect(() => {
    console.debug('[JupiterCellListItem] updated cell:', cell)
    if (typeof onChange === 'function' && cell.changed) {
      onChange(cell)
    }
  }, [cell])

  return (
    <div className="JupiterCellListItem">
      <label className="fw-bold small">
        {num}
      </label>
      <div className="JupiterCellListItem_buttons">

        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => onClickHandler({
            isHermeneutic: !cell.isHermeneutic
          })}
        >
          Hermeneutics {cell.isHermeneutic && <b>ON</b>}
        </Button>
        <Button
          className="ms-1"
          variant="outline-accent"
          size="sm"
          onClick={() => onClickHandler({
            type: cell.type==='markdown' ? 'code' : 'markdown'
          })}
        >
          Data {cell.type==='code' && <b>ON</b>}
        </Button>
        <Button
          className="ms-1"
          variant="outline-dark"
          size="sm"
          onClick={() => onClickHandler({
            isHeading: !cell.isHeading,
            // force cell markdown type
            type: 'markdown'
          })}
        >
          Heading {cell.isHeading && <b>ON</b>}
        </Button>
      </div>
      {debug === true && (
        <div>
          Current cell representation:
          <pre>{JSON.stringify(cell, null, 2)}</pre>
          Original cell:
          <pre>{JSON.stringify(initial, null, 2)}</pre>
        </div>
      )}
      <div className="mt-1">
        <Jupitercell
          isHermeneutics={cell.isHermeneutic}
          isData={cell.type==='code'}
        >
          {children}
        </Jupitercell>
      </div>
    </div>
  );
}


export default JupiterCellListItem
