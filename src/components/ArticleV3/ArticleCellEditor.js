import React, { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

import { useExecutionScope } from './ExecutionScope'

// import codemirror style
import 'codemirror/lib/codemirror.css'
// import codemirror dracula style
import 'codemirror/theme/dracula.css'
// import codemirror python mode
import 'codemirror/mode/python/python.js';


const ArticleCellEditor = ({
  cellIdx = -1,
  options
}) => {

  const source = useExecutionScope((state) => state.cells[cellIdx]?.source) ?? '';

  const [value, setValue] = useState(source);

  const updateCellSource = useExecutionScope((state) => state.updateCellSource);

  const onCellChangeHandler = (value) => {
    console.debug('[ArticleCell] onCellChangeHandler', cellIdx, { value })
    updateCellSource(cellIdx, value)
  }

  //  For reset feature
  useEffect(() => {
    setValue(source); 
  }, [source]);

  return (
    <div className="ArticleCellEditor" >
      <CodeMirror
        value={value}
        options={{
          theme: 'dracula',
          mode: 'python',
          lineNumbers: true,
          lineWrapping: true,
          styleActiveLine: true,
          matchBrackets: true,
          ...options,
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value)
        }}
        onChange={(editor, data, value) => {
          console.debug('[ArticleCellEditor]', cellIdx, { value })
          onCellChangeHandler(value)
        }}
      />
    </div>
  )
}

export default ArticleCellEditor
