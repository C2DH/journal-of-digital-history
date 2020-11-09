import React from 'react'
import { Form } from 'react-bootstrap'
import { useStore } from '../store'

const SwitchNightMode = () => {
  const mode =  useStore((state) => state.mode);
  console.info('NightSwitcher initial mode:', mode)
  const handleChange = (event) => {
    console.log(event.target.checked)
  }
  return (
    <Form>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="dark"
        defaultChecked={mode === 'dark'}
        onChange={handleChange}
      />
    </Form>)
}

export default SwitchNightMode
