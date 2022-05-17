import React from 'react'
import { Button, Form } from 'react-bootstrap'
import './JupyterCell.scss'

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
  const [ showTagsEditor, setShowTagsEditor ] = React.useState(false)
  const tags = cell.metadata?.tags
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

  const onTagsChangeHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowTagsEditor(false)
    if (typeof onChange === 'function' ) {
      const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries())
      onChange({
        ...cell,
        metadata: {
          ...cell.metadata,
          tags: formDataObj.inputTags.split(/\s*,\s*/)
        }
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
    <div
      className={`JupyterCell shadow-sm ${className} ${cell.cell_type} ${tags.join(' ')} `}
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
          <div className="JupyterCell__tagLabel " >tags</div>
          {tags.map((t, i) => (
            <div key={i} className={`JupyterCell__tag ${t}`}><span>{t}</span></div>
          ))}
          <Button
            className="JupyterCell__tagLabel" size="sm" variant='outline-secondary'
            onClick={() => setShowTagsEditor(!showTagsEditor)}
          >(edit tags)</Button>
        </div>
        {showTagsEditor && (
          <Form onSubmit={onTagsChangeHandler} className="p-2 mb-2 border">
            <Form.Label htmlFor={`inputTags${idx}`} className="JupyterCell__tagLabel">enter the list of <i>tags</i> separated by <code>,</code></Form.Label>
            <Form.Control
              type="textarea"
              className="JupyterCell__source"
              id={`inputTags${idx}`}
              name={`inputTags`}
              defaultValue={tags.join(', ')}
              aria-describedby={`inputTagsHelp${idx}`}
            />
            <Button type="submit" className="JupyterCell__tagLabel" size="sm" variant='outline-secondary'>apply</Button>
          </Form>
        )}
        <Form.Control
          as="textarea"
          className="JupyterCell__source multiple-rows"
          id={`inputTags${idx}`}
          defaultValue={source}
          onChange={onChangeHandler}
          aria-describedby={`inputTagsHelp${idx}`}
        />
      </div>
      <div className="JupyterCell__rendered p-2">
      <label className="fw-bold small text-muted me-1 px-2 monospace" style={{backgroundColor: 'var(--gray-200)'}}>
        {num}
      </label> {parsedCell.firstWords}
      </div>
    </div>
    </>
  )
}

export default JupyterCell
