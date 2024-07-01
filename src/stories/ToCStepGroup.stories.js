import React from 'react'
import ToCStepGroup from '../components/ToCStepGroup'

export default {
  component: ToCStepGroup,
  title: 'ToCStepGroup',
  argTypes: {
    width: { control: { type: 'number' } },
    steps: { control: { type: 'object' } },
    onClick: { action: 'clicked' },
    active: {
      required: false,
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
}

const Template = (args) => {
  return <ToCStepGroup {...args} />
}

export const Default = Template.bind({})

Default.args = {
  steps: [
    {
      id: 128,
      label: 'figure 51',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 63,
    },
    {
      id: 130,
      label: 'figure 52',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 64,
    },
    {
      id: 132,
      label: 'figure 53',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 65,
    },
    {
      id: 134,
      label: 'figure 54',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 66,
    },
    {
      id: 136,
      label: 'figure 55',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 67,
    },
    {
      id: 137,
      label: 'figure 55',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 67,
    },
    {
      id: 138,
      label: 'figure 56',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 67,
    },
    {
      id: 139,
      label: 'figure 57',
      isFigure: true,
      isTable: false,
      isHermeneutics: true,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 67,
    },
    {
      id: 140,
      label: 'figure 58',
      isFigure: true,
      isTable: false,
      isHermeneutics: false,
      level: 'CODE',
      isSectionStart: false,
      isSectionEnd: false,
      count: 67,
    },
  ],
}
