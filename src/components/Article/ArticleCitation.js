import React, {useState} from 'react'
import {Clipboard} from 'react-feather'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {OverlayTrigger, Tooltip, Button} from 'react-bootstrap'


const ArticleCitation = ({ text }) => {
  const [isCopied, setIsCopied] = useState(null)
  if(!text) {
    return null
  }
  return (
    <div className="ArticleCitation d-flex w-100">
      <p className="flex-grow-1" dangerouslySetInnerHTML={{ __html: text }}></p>
      <div className="flex-shrink-1">
      <OverlayTrigger
        placement="right"
        onToggle={(e) => { !e && setIsCopied(false)}}
        overlay={
          <Tooltip id="button-tooltip">
            {isCopied ? 'copied!': 'copy to clipboard'}
          </Tooltip>
        }
      >
      <CopyToClipboard
        options={{ format: "text/plain"}}
        text={text}
        onCopy={() => setIsCopied(true)}
      >
        <Button size="sm" variant="outline-secondary">
          <Clipboard size={16}/>
        </Button>
      </CopyToClipboard>
      </OverlayTrigger>

      </div>
    </div>
  )
}

export default ArticleCitation
