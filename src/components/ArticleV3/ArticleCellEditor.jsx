import React, { useEffect, useState, useRef, useCallback} from 'react'
import { EditorView, highlightActiveLineGutter, lineNumbers } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { python } from '@codemirror/lang-python'
import { dracula } from '@uiw/codemirror-theme-dracula'

import { useExecutionScope } from './ExecutionScope'

const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const ArticleCellEditor = ({ cellIdx = -1 }) => {
  const editorRef = useRef(null)
  const source = useExecutionScope((state) => state.cells[cellIdx]?.source ?? '') 
  const [value, setValue] = useState(source)
  
  const updateCellSource = useExecutionScope((state) => state.updateCellSource)
  const onCellChangeHandler = useCallback(
    debounce((newValue) => {
      console.debug('[ArticleCell] onCellChangeHandler', cellIdx, { newValue })
      updateCellSource(cellIdx, newValue)
    }, 300),
    [cellIdx, updateCellSource]
  )


  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          python(),
          dracula,
          lineNumbers(),
          highlightActiveLineGutter(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newValue = update.state.doc.toString()
              setValue(newValue)
              onCellChangeHandler(newValue)
            }
          }),
          // ...options, // Ensure options is an array
        ],
      })

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      })
    
      return () => {
        view.destroy()
      }
    
    }
  }, [editorRef, value])

  // For reset feature
  useEffect(() => {
    setValue(source)
  }, [source])

  return <div ref={editorRef} className="ArticleCellEditor" />
}

export default ArticleCellEditor
