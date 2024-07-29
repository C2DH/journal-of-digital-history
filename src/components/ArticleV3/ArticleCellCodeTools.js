import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'

import { useExecutionScope } from './ExecutionScope'
import ConnectionStatusBox from './ConnectionStatusBox'
import { useArticleThebe } from './ArticleThebeProvider'
import ArticleCellRunCodeButton, {
  StatusBeforeExecuting,
  StatusError,
  StatusExecuting,
  StatusIdle,
  StatusScheduled,
  StatusSuccess,
} from './ArticleCellRunCodeButton'

import shineIcon from '../../assets/icons/shine_white.png'

import '../../styles/components/ArticleV3/ArticleCellCodeTools.scss'

const ArticleCellCodeTools = ({ cellIdx = -1 }) => {
  const { ready, connectAndStart, starting, session, connectionErrors } = useArticleThebe()

  const executing = useExecutionScope((state) => state.cells[cellIdx]?.executing)
  const scheduled = useExecutionScope((state) => state.cells[cellIdx]?.scheduled)
  const pending = useExecutionScope((state) => state.cells[cellIdx]?.pending)
  const success = useExecutionScope((state) => state.cells[cellIdx]?.success)
  const errors = useExecutionScope((state) => state.cells[cellIdx]?.errors)
  // const thebeCell     = useExecutionScope((state) => state.cells[cellIdx]?.thebe);
  const executeCell = useExecutionScope((state) => state.executeCell)
  const scheduleCell = useExecutionScope((state) => state.scheduleCell)
  // const clearCell     = useExecutionScope((state) => state.clearCell);
  const resetCell = useExecutionScope((state) => state.resetCell)
  const attachSession = useExecutionScope((state) => state.attachSession)
  const attached = useExecutionScope((state) => state.cells[cellIdx]?.attached)
  const status =
    connectionErrors || errors
      ? StatusError
      : scheduled
      ? StatusScheduled
      : pending
      ? StatusBeforeExecuting
      : executing
      ? StatusExecuting
      : success
      ? StatusSuccess
      : StatusIdle

  const onRunButtonClickHandler = () => {
    if (!ready || connectionErrors) {
      connectAndStart()
      scheduleCell(cellIdx)
    } else {
      executeCell(cellIdx)
    }
  }

  useEffect(() => {
    if (!scheduled || !ready) return
    if (!attached) attachSession(session)

    executeCell(cellIdx)
  }, [ready, scheduled])

  return (
    <div className="ArticleCellCodeTools">
      <div className="d-flex gap-2 align-items-start">
        <ArticleCellRunCodeButton
          status={status}
          onClick={onRunButtonClickHandler}
          disabled={starting}
        />
      </div>

      <ConnectionStatusBox />

      {ready && (
        <Button
          variant="outline-white"
          className="reset-btn"
          size="sm"
          onClick={() => resetCell(cellIdx)}
        >
          <img src={shineIcon} />
          <span>Reset cell</span>
        </Button>
      )}
    </div>
  )
}

export default ArticleCellCodeTools
