import React from 'react'
import { useExecutionScope } from './ExecutionScope'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'

export default function ArticleCellSourceCodeWrapper(props) {
  const { cellIdx } = props
  const source = useExecutionScope((state) => state.cells[cellIdx]?.source) ?? ''
  return <ArticleCellSourceCode content={source} visible language="python" />
}
