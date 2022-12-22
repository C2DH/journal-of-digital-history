import React from 'react'
import ToCStep from './ToCStep'

export default {
  component: ToCStep,
  title: 'ToCStep',
  argTypes: {
    step: {
      required: true,
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
    isSectionStart: { control: { type: 'boolean' }, defaultValue: false },
    isSectionEnd: { control: { type: 'boolean' }, defaultValue: false },
    onclick: { action: 'clicked' },
  },
}

const Template = (args) => {
  return <ToCStep {...args} />
}

export const Default = Template.bind({})
export const LevelH2 = Template.bind({})
export const LevelH3 = Template.bind({})

Default.args = {
  step: { isFigure: true, level: 'CODE', isHermeneutics: true },
  isSectionStart: false,
  isSectionEnd: false,
  width: 200,
  children: 'Figure 4',
}

LevelH3.args = {
  step: { level: 'H3' },
  isSectionStart: true,
  width: 140,
  children: <>This is a basic content, limited</>,
}

LevelH3.args = {
  step: { level: 'H3' },
  isSectionStart: true,
  width: 140,
  children: <>This is a basic content, limited</>,
}
LevelH2.args = {
  step: { level: 'H2' },
  isSectionStart: true,
  width: 140,
  children: <>This is a basic content, limited</>,
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
