import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BookOpen } from 'react-feather'
import ArticleCitationModal from './ArticleCitationModal'


const ArticleCitation = (props) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="ArticleCitation" {...props}>
      <Button size="sm" variant="outline-secondary" onClick={() => setIsVisible(true)}>
        <BookOpen size={12}/>
        <span className="ms-2">
        Cite as ...
        </span>
      </Button>

      <ArticleCitationModal
        show={isVisible}
        onHide={() => setIsVisible(false)}
      />
    </div>
  );
}

export default ArticleCitation
