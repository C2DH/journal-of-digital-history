import { Meta, StoryObj } from '@storybook/react'

import Toast from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Dashboard/Toast',
  component: Toast,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    open: true,
    message: 'Your Bluesky post was published!',
    submessage: 'Take a look <a href="">here</a> →',
    type: 'info',
    onClose: () => console.log('Toast closed'),
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {}

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'This is a warning message!',
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'An error occurred while processing your request.',
  },
}

export const WithCustomSubmessage: Story = {
  args: {
    submessage: 'Click <a href="#">here</a> for more details.',
  },
}

export const Closed: Story = {
  args: {
    open: false,
  },
}
