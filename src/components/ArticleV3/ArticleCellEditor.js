import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { useExecutionScope } from './ExecutionScope'
// import codemirror style
import 'codemirror/lib/codemirror.css'
// import codemirror dracula style
import 'codemirror/theme/dracula.css'

const ArticleCellEditor = ({ cellIdx = -1, options }) => {
  const source = useExecutionScope((state) => state.cells[cellIdx]?.source) ?? ''
  const [value, setValue] = React.useState(source)

  const updateCellSource = useExecutionScope((state) => state.updateCellSource)
  const onCellChangeHandler = (value) => {
    console.debug('[ArticleCell] onCellChangeHandler', cellIdx, { value })
    updateCellSource(cellIdx, value)
  }

  return (
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
  )
}

export default ArticleCellEditor
