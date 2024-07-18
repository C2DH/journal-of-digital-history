/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Play as PlayIcon } from 'react-feather';

import { useExecutionScope } from './ExecutionScope';
import ArticleCellError from './ArticleCellError';
import ConnectionStatusBox from './ConnectionStatusBox';
import { useArticleThebe } from './ArticleThebeProvider';

import shineIcon from '../../assets/icons/shine_white.png';

import '../../styles/components/ArticleV3/ArticleCellCodeTools.scss';


const ArticleCellCodeTools = ({
  cellIdx = -1,
  errors
}) => {

  const [toExecute, setToExecute] = useState(false);

  const { ready, connectAndStart, starting, session, connectionErrors } = useArticleThebe();

  const executing     = useExecutionScope((state) => state.cells[cellIdx]?.executing);
  const thebeCell     = useExecutionScope((state) => state.cells[cellIdx]?.thebe);
  const executeCell   = useExecutionScope((state) => state.executeCell);
  // const clearCell     = useExecutionScope((state) => state.clearCell);
  const resetCell     = useExecutionScope((state) => state.resetCell);
  const attachSession = useExecutionScope((state) => state.attachSession);
  const attached      = useExecutionScope((state) => state.cells[cellIdx]?.attached);

  const onRunButtonClickHandler = () => {
    if (!ready) {
      connectAndStart();
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
        <Button
          variant   = "outline-white"
          size      = "sm"
          disabled  = {starting || executing || connectionErrors}
          onClick   = {onRunButtonClickHandler}
        >
          <PlayIcon size={16} />
          <span>Run code</span>
        </Button>

        {thebeCell?.executionCount > 0 && (
          <div title="execution count">[{thebeCell?.executionCount}]:</div>
        )}
        <div>
          {
            starting && toExecute ? 'launching binder and running cell...' :
            starting ? 'launching binder...' :
            executing ? 'running...' : 
            errors ? 'error' :
            ready ? 'ready' : ''
          }
        </div>
      </div>

      <ConnectionStatusBox />

      {errors && <ArticleCellError errors={errors} />}

      {ready &&
        <Button
          variant   = "outline-white"
          size      = "sm"
          onClick   = {() => resetCell(cellIdx)}
        >
          <img src={shineIcon} />
          <span>Reset cell</span>
        </Button>
      }

      <Button
        variant="outline-white"
        size="sm"
      >
        <img src={shineIcon} />
        <span>Explain code</span>
      </Button>
    </div>
  );
}

export default ArticleCellCodeTools;