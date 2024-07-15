import React, { useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Button } from 'react-bootstrap'
import { Eye, EyeOff } from 'react-feather';
import { useTranslation } from 'react-i18next';

import { useExecutionScope } from './ExecutionScope'

// import codemirror style
import 'codemirror/lib/codemirror.css'
// import codemirror dracula style
import 'codemirror/theme/dracula.css'
// import codemirror python mode
import 'codemirror/mode/python/python.js';


const ArticleCellEditor = ({
  cellIdx = -1,
  options,
  toggleVisibility = false,
  visible = false
}) => {

  const source = useExecutionScope((state) => state.cells[cellIdx]?.source) ?? '';

  const [isSourceCodeVisible, setIsSourceCodeVisible] = useState(visible);
  const [value, setValue] = useState(source);

  const { t } = useTranslation();
  const updateCellSource = useExecutionScope((state) => state.updateCellSource);

  const onCellChangeHandler = (value) => {
    console.debug('[ArticleCell] onCellChangeHandler', cellIdx, { value })
    updateCellSource(cellIdx, value)
  }

  return (
    <div className="ArticleCellEditor" >
      {toggleVisibility &&
          <div>
            <Button size="sm" variant="outline-white" onClick={() => setIsSourceCodeVisible(!isSourceCodeVisible)}>
            {isSourceCodeVisible? <EyeOff size="16"/> : <Eye size="16"/>}
            <span className="ms-2">{t(isSourceCodeVisible
              ? 'actions.hidesourceCode'
              : 'actions.showsourceCode'
            )}</span>
          </Button>
          </div>
      }

      {(!toggleVisibility || isSourceCodeVisible) &&
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
      }
    </div>
  )
}

export default ArticleCellEditor
