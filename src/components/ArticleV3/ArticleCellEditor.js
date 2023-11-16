import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
// import codemirror style
import 'codemirror/lib/codemirror.css'
// import codemirror dracula style
import 'codemirror/theme/dracula.css'

const ArticleCellEditor = ({ cellIdx = -1, source = '', options, onChange }) => {
  const [value, setValue] = React.useState(source)
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
        typeof onChange === 'function' && onChange(value)
      }}
    />
  )
}

export default ArticleCellEditor
