import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { useTranslation } from 'react-i18next';

import ArticleCellEditor from './ArticleCellEditor';
import { useExecutionScope } from './ExecutionScope';

import '../../styles/components/ArticleV3/ArticleCellSourceCodeWrapper.scss';
import { ExpandLines } from 'iconoir-react';


const ArticleCellSourceCodeWrapper = ({
  cellIdx = -1,
  readOnly = false,
  toggleVisibility = false,
  visible = false
}) => {

  const [isSourceCodeVisible, setIsSourceCodeVisible] = useState(visible);
  const [isCollapsed, setIsCollapsed]                 = useState(!toggleVisibility);

  const executing = useExecutionScope((state) => state.cells[cellIdx]?.executing);
  const pending   = useExecutionScope((state) => state.cells[cellIdx]?.pending);
  const { t }     = useTranslation();

  useEffect(() => {
    if ((executing || pending) && isCollapsed)
      setIsCollapsed(false);
  }, [executing, pending]);

  return (
    <div className={`ArticleCellSourceCodeWrapper ${isCollapsed ? 'collapsed' : ''} ${toggleVisibility ? 'toggle-visibility' : ''}`}>
      {toggleVisibility &&
        <div>
          <Button
            size="sm"
            variant="outline-white"
            onClick={() => setIsSourceCodeVisible(!isSourceCodeVisible)}
          >
            {isSourceCodeVisible ? <EyeOff size="16" /> : <Eye size="16" />}
            
            <span className="ms-2">{t(isSourceCodeVisible
              ? 'actions.hidesourceCode'
              : 'actions.showsourceCode'
            )}</span>
          </Button>
        </div>
      }

      {(!toggleVisibility || isSourceCodeVisible) &&
        <React.Suspense fallback={<div>loading...</div>}>
          <ArticleCellEditor
            cellIdx           = {cellIdx}
            toggleVisibility  = {toggleVisibility}
            visible           = {visible}
            options           = {{
              readOnly: readOnly || isCollapsed ? 'nocursor' : false
            }}
          />
        </React.Suspense>
      }

      {isCollapsed &&
        <div className="expandButton">
          <button
            className = "btn btn-sm btn-outline-white-secondary btn-pill d-flex align-items-center"
            onClick   = {() => setIsCollapsed(false)}
          >
            <div className="px-2">{t('actions.expand')}</div>
            <ExpandLines className="pe-1" width={16} height={16} />
          </button>
        </div>
      }
    </div>
  )
}

export default ArticleCellSourceCodeWrapper;
