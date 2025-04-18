import React from 'react'
import OrderByDropdown from '../components/OrderByDropdown'

export default {
  component: OrderByDropdown,
  title: 'OrderByDropdown',
  argTypes: {
    id: {
      required: false,
      control: { type: 'text' },
      defaultValue: 'dropdown-basic-button',
    },
    className: {
      required: false,
      control: { type: 'text' },
      defaultValue: '',
    },
    disabled: {
      required: false,
      control: { type: 'boolean' },
      defaultValue: false,
    },
    size: {
      defaultValue: 'sm',
      description: 'edit identifier',
      required: false,
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    variant: {
      defaultValue: 'outline-secondary',
      required: false,
      options: ['outline-secondary'],
      control: { type: 'select' },
    },
    onChange: { action: 'changed' },
  },
}

const Template = (args) => {
  return <OrderByDropdown {...args} />
}

export const Default = Template.bind({})

Default.args = {
  title: 'Default title',
  selectedValue: 'firstValue',
  values: [
    {
      value: 'firstValue',
      label: 'this is the selected first value',
    },
    { value: 'secondValue', label: 'second Value' },
  ], // array of [{value:'abc', label:''}]
}

// const argTypes = {
//   label: {
//     name: 'label',
//     type: { name: 'string', required: false },
//     defaultValue: 'Hello',
//     description: 'demo description',
//     table: {
//       type: { summary: 'string' },
//       defaultValue: { summary: 'Hello' },
//     },
//     control: {
//       type: 'text'
//     }
//   }
// }
