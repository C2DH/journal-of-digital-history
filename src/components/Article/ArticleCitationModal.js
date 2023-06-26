import React, { useState } from 'react'
import { Modal, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import Citation from '../Citation'
import '../../styles/components/Article/ArticleCitationModal.scss'
// import CopyToClipboardTrigger from '../CopyToClipboardTrigger'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
// import {OverlayTrigger, Tooltip, Button} from 'react-bootstrap'
const ReplaceSpecialChars = (text) => {
  return text.replace(/&#38;quot;/g, '&quot;')
}
const ArticleCitationModal = (props) => {
  const choices = [
    { format: 'bibtex', label: 'bibtex' },
    { format: 'html', template: 'apa', label: 'APA', replaceFn: ReplaceSpecialChars },
    // { format: 'html', template: 'mla', label: 'MLA' },
    // { format: 'html', template: 'vancouver', label: 'vancouver' },
    { format: 'html', template: 'harvard1', label: 'harvard', replaceFn: ReplaceSpecialChars },
  ]
  const [value, setValue] = useState(1)
  const handleChange = (val) => {
    setValue(val)
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="shadow"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Cite as ...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToggleButtonGroup type="radio" name="boh" value={value} onChange={handleChange}>
          {choices.map((d, i) => (
            <ToggleButton
              key={i}
              id={`tbg-btn-${i}`}
              variant="outline-secondary"
              size="sm"
              value={i}
            >
              {d.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <div className="ArticleCitationModal_field mt-3 position-relative">
          <Citation
            {...choices[value]}
            bibjson={props.bibjson}
            className="p-2 rounded all-copy"
            style={{
              backgroundColor: 'var(--gray-400)',
            }}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ArticleCitationModal
