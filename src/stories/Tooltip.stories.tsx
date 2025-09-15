import { Meta, StoryFn } from '@storybook/react'

import CustomTooltip from '../components/Tooltip/Tooltip'

export default {
  title: 'Components/Tooltip',
  component: CustomTooltip,
  argTypes: {
    text: { control: 'text', description: 'The tooltip text key for translation' },
    tooltipPlacement: {
      control: { type: 'select' },
      options: ['auto', 'top', 'right', 'bottom', 'left'],
      description: 'The placement of the tooltip',
    },
    fieldname: { control: 'text', description: 'The field name for unique tooltip ID' },
    index: { control: 'number', description: 'The index for unique tooltip ID' },
  },
} as Meta<typeof CustomTooltip>

const Template: StoryFn<typeof CustomTooltip> = (args) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CustomTooltip {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  text: 'This is an example tooltip text for right placement',
  tooltipPlacement: 'right',
  fieldname: 'exampleField',
  index: 0,
}

export const TopPlacement = Template.bind({})
TopPlacement.args = {
  text: 'This is an example tooltip text for top placement',
  tooltipPlacement: 'top',
  fieldname: 'exampleField',
  index: 1,
}

export const BottomPlacement = Template.bind({})
BottomPlacement.args = {
  text: 'This is an example tooltip text for bottom placement',
  tooltipPlacement: 'bottom',
  fieldname: 'exampleField',
  index: 2,
}
