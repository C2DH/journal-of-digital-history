import React, { useEffect, useState, useRef } from 'react'
import { EditorView } from '@codemirror/basic-setup'
import { EditorState } from '@codemirror/state'
import { python } from '@codemirror/lang-python'
import { darcula } from '@uiw/codemirror-theme-darcula'

import { useExecutionScope } from './ExecutionScope'

const ArticleCellEditor = ({ cellIdx = -1, options = [] }) => {
  const editorRef = useRef(null)
  const source = useExecutionScope((state) => state.cells[cellIdx]?.source ?? '') 
  const [value, setValue] = useState(source)
  
  const updateCellSource = useExecutionScope((state) => state.updateCellSource)
  const onCellChangeHandler = (value) => {
    console.debug('[ArticleCell] onCellChangeHandler', cellIdx, { value })
    updateCellSource(cellIdx, value)
  }

  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: value,
        extensions: [
          python(),
          darcula,
          EditorView.updateListener.of((update) => {
            if (update.changes) {
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
  }, [editorRef, value, options])

  // For reset feature
  useEffect(() => {
    setValue(source)
  }, [source])

  return <div ref={editorRef} className="ArticleCellEditor" />
}

export default ArticleCellEditor
