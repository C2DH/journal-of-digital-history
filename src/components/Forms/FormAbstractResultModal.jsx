import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import FormJSONSchemaErrorListItem from './FormJSONSchemaErrorListItem'


const FormAbstractResultModal = ({errors = [], onConfirm, ...props}) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        {errors.map((error,i) => <FormJSONSchemaErrorListItem  key={i} error={error} />)}
        <Button variant="primary" onClick={onConfirm}>Close</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="outline-dark" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FormAbstractResultModal
