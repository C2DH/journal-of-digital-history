import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import { Eye, EyeOff } from 'react-feather'
import hljs from "highlight.js"; // import hljs library
import 'highlight.js/styles/dracula.css';


const ArticleCellSourceCode = ({ content, language, toggleVisibility, visible, right }) => {
  const [isSourceCodeVisible, setIsSourceCodeVisible] = useState(visible)
  const { t } = useTranslation()
  const highlighted = language
      ? hljs.highlight(language, content)
      : hljs.highlightAuto(content);

  return (
    <div className="ArticleCellSourceCode " >
      {toggleVisibility
        ? (
          <div className={right?'text-right':''}>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsSourceCodeVisible(!isSourceCodeVisible)}>
            {isSourceCodeVisible? <EyeOff size="16"/> : <Eye size="16"/>}
            <span className="ml-2">{t(isSourceCodeVisible
              ? 'actions.hidesourceCode'
              : 'actions.showsourceCode'
            )}</span>
          </Button>
          </div>
        )
        : null
      }
      <pre className={`hljs ${isSourceCodeVisible ? 'd-block': 'd-none'}`}>
          <code
              className="hljs"
              dangerouslySetInnerHTML={{ __html: highlighted.value }}
          />
      </pre>
    </div>
  )
}

export default ArticleCellSourceCode
