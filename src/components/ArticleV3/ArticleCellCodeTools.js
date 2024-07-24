/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { useExecutionScope } from './ExecutionScope';
import ArticleCellError from './ArticleCellError';
import ConnectionStatusBox from './ConnectionStatusBox';
import { useArticleThebe } from './ArticleThebeProvider';
import ArticleCellRunCodeButton, {
  StatusBeforeExecuting,
  StatusDisabled,
  StatusError,
  StatusExecuting,
  StatusIdle,
  StatusSuccess
} from './ArticleCellRunCodeButton';

import shineIcon from '../../assets/icons/shine_white.png';

import '../../styles/components/ArticleV3/ArticleCellCodeTools.scss';
import ArticleCellExplainCodeButton from './ArticleCellExplainCodeButton';


const ArticleCellCodeTools = ({ cellIdx = -1 }) => {

  const [toExecute, setToExecute] = useState(false);

  const { ready, connectAndStart, starting, session, connectionErrors } = useArticleThebe();

  const executing     = useExecutionScope((state) => state.cells[cellIdx]?.executing);
  const success       = useExecutionScope((state) => state.cells[cellIdx]?.success);
  const errors        = useExecutionScope((state) => state.cells[cellIdx]?.errors);
  const thebeCell     = useExecutionScope((state) => state.cells[cellIdx]?.thebe);
  const executeCell   = useExecutionScope((state) => state.executeCell);
  // const clearCell     = useExecutionScope((state) => state.clearCell);
  const resetCell     = useExecutionScope((state) => state.resetCell);
  const attachSession = useExecutionScope((state) => state.attachSession);
  const attached      = useExecutionScope((state) => state.cells[cellIdx]?.attached);
  const status =
    connectionErrors || errors ? StatusError :
    toExecute ? StatusBeforeExecuting :
    starting ? StatusDisabled :
    executing ? StatusExecuting :
    success ? StatusSuccess : StatusIdle;

  const onRunButtonClickHandler = () => {
    if (!ready) {
      connectAndStart();
      executeCell(cellIdx);
      setToExecute(true);
    } else {
      executeCell(cellIdx);
    }
  }

  useEffect(() => {
    if (!toExecute || !ready) return;
    if (!attached) attachSession(session);

    executeCell(cellIdx);
    setToExecute(false);
  }, [ready])

  return (
    <div className="ArticleCellCodeTools">
      <div className="d-flex gap-2 align-items-start"> 
        <ArticleCellRunCodeButton status={status}  onClick={onRunButtonClickHandler} />
      </div>

      <ConnectionStatusBox />

      {errors && <ArticleCellError errors={errors} />}

      {ready &&
        <Button
          variant   = "outline-white"
          className = "reset-btn"
          size      = "sm"
          onClick   = {() => resetCell(cellIdx)}
        >
          <img src={shineIcon} />
          <span>Reset cell</span>
        </Button>
      }

      <ArticleCellExplainCodeButton />
    </div>
  );
}

export default ArticleCellCodeTools;