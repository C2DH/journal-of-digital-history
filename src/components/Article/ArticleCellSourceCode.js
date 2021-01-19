import React from 'react'
import hljs from "highlight.js"; // import hljs library
import 'highlight.js/styles/dracula.css';

const ArticleCellSourceCode = ({ content, language }) => {
  const highlighted = language
      ? hljs.highlight(language, content)
      : hljs.highlightAuto(content);
  return (
    <div className="ArticleCellSourceCode" >
      <pre className="hljs">
          <code
              className="hljs"
              dangerouslySetInnerHTML={{ __html: highlighted.value }}
          />
      </pre>
    </div>
  )
}

export default ArticleCellSourceCode
