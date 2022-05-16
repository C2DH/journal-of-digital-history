import React from 'react'
import './JupyterCell.css'

const JupyterCell = ({
  cell = {},
  parsedCell = {},
  className='',
  idx,
  num,
  onChange,
  onMouseLeave,
  onMouseEnter,
}) => {
  const tags = Array.isArray(cell.metadata?.tags)
    ? cell.metadata?.tags
    : []
  const source = cell.source.join('\n')
  const onChangeHandler = (e) => {
    if (typeof onChange === 'function' ) {
      onChange({
        ...cell,
        source: e.target.value.split('\n')
      })
    }
  }

  const onCellTypeClickHandler = () => {
    if (typeof onChange === 'function' ) {
      onChange({
        ...cell,
        cell_type: cell.cell_type === 'code' ? 'markdown' : 'code'
      })
    }
  }
  return (
    <>
    <label className="fw-bold small">
      {num}
    </label>
    <div
      className={`JupyterCell shadow-sm ${className} `}
      onMouseEnter={(e) => onMouseEnter(e, idx)}
      onMouseLeave={onMouseLeave}
    >
      <div className="JupyterCell__header">

      </div>
      <div className="p-2">

        <div className="JupyterCell__tags mb-2">
          <div className="JupyterCell__tagLabel" >type</div>
          <div
            className="JupyterCell__cellTypeSwitch d-flex"
            onClick={onCellTypeClickHandler}
          >
            <div className={`code ${cell.cell_type === 'code' ? 'active' : ''}`}>code</div>
            <div className={cell.cell_type === 'code' ? '' : 'active'}>markdown</div>
          </div>
          <div className="JupyterCell__tagLabel ms-2" >tags</div>
          {tags.map((t, i) => (
            <div key={i} className="JupyterCell__tag">{t}</div>
          ))}
        </div>
        <textarea
          className="JupyterCell__source"
          defaultValue={source}
          onChange={onChangeHandler}
        />
      </div>
      <div className="JupyterCell__rendered p-2">
        {parsedCell.firstWords}
      </div>
    </div>
    </>
  )
}

export default JupyterCell
