import React from 'react'
import ToCStep from '../components/ToCStep'

export default {
  component: ToCStep,
  title: 'Components/Table of Contents/Steps',
  argTypes: {
    id: {
      required: true,
      control: { type: 'number' },
      defaultValue: 1,
    },
    label: {
      required: true,
      control: { type: 'text' },
      defaultValue: 'Very long step label, that could be a very long subheading',
    },
    className: {
      required: false,
      control: { type: 'text' },
      defaultValue: '',
    },
    active: {
      required: false,
      control: { type: 'boolean' },
      defaultValue: false,
    },
    isVisible: { control: { type: 'boolean' }, defaultValue: false },
    isHermeneutics: { control: { type: 'boolean' }, defaultValue: false },
    isTable: { control: { type: 'boolean' }, defaultValue: false },
    isFigure: { control: { type: 'boolean' }, defaultValue: false },
    level: {
      defaultValue: 'CODE',
      required: false,
      options: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE'],
      control: { type: 'select' },
    },
    isSectionStart: { control: { type: 'boolean' }, defaultValue: false },
    isSectionEnd: { control: { type: 'boolean' }, defaultValue: false },
    onClick: { action: 'clicked' },
  },
}

const Template = (args) => {
  return <ToCStep {...args} />
}

export const Default = Template.bind({})
export const LevelH2 = Template.bind({})
export const LevelH3 = Template.bind({})

Default.args = {
  isFigure: true,
  level: 'CODE',
  isHermeneutics: true,
  isSectionStart: false,
  isSectionEnd: false,
  width: 200,
  label: 'Figure 4',
}

LevelH3.args = {
  level: 'H3',
  isSectionStart: true,
  width: 140,
}

LevelH3.args = {
  level: 'H3',
  isSectionStart: true,
  width: 140,
}
LevelH2.args = {
  level: 'H2',
  isSectionStart: true,
  width: 140,
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
