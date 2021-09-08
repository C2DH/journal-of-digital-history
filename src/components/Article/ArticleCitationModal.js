import React, {useState} from 'react'
import { Modal, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import Citation from '../Citation'
import CopyToClipboardTrigger from '../CopyToClipboardTrigger'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
// import {OverlayTrigger, Tooltip, Button} from 'react-bootstrap'

const ArticleCitationModal = (props) => {
  const choices = [
    { format: 'bibtex', label: 'bibtex' },
    { format: 'html', template: 'apa', label: 'APA' },
    { format: 'html', template: 'mla', label: 'MLA' }
  ]
  const [value, setValue] = useState(1);
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
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Cite as ...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <ToggleButtonGroup type="radio" name="boh"  value={value} onChange={handleChange}>
        {choices.map((d, i) => (
          <ToggleButton key={i} id={`tbg-btn-${i}`} variant="outline-secondary" size="sm" value={i}>
            {d.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
        <div className="mt-3 position-relative">
         <Citation {...choices[value]} className="p-2 rounded all-copy" style={{
          maxHeight: 100, overflow:"scroll",
          backgroundColor: 'var(--gray-400)'
        }} ClipboardComponent={CopyToClipboardTrigger} />
        </div>
      </Modal.Body>
      <Modal.Footer>

        <Button size="sm" variant="outline-secondary" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ArticleCitationModal
