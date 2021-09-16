import React, { useState, useEffect,useRef } from 'react'
import {Clipboard} from 'react-feather'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Tooltip, Button} from 'react-bootstrap'


const CopyToClipboardTrigger = ({ text, delay=1500 }) => {
  const [isCopied, setIsCopied] = useState(null)
  const target = useRef(null)
  if(!text) {
    return null
  }
  useEffect(() => {
    if (isCopied) {
      setIsCopied(false)
    }
  }, [text])
  useEffect(() => {
    let timer
    if (isCopied) {
      setTimeout(() => setIsCopied(false), delay)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isCopied])
  return (
    <div className="position-absolute" style={{
      bottom: 'var(--spacer-2)',
      right: 'var(--spacer-2)',
    }}>
    <CopyToClipboard
      options={{ format: "text/html"}}
      text={text}
      onCopy={() => setIsCopied(true)}
    >
      <Button ref={target} size="sm" className="bg-gray" variant="outline-secondary">
        {isCopied? 'copied! ': ''}<Clipboard size={16}/>
      </Button>
    </CopyToClipboard>

      <Tooltip id="button-tooltip">
        copied!
      </Tooltip>

    </div>
  )
}

export default CopyToClipboardTrigger
