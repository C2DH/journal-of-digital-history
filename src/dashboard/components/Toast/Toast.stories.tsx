import { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'

import { useNotificationStore } from '../../store'
import Toast from './Toast'

// Wrapper component to set notification state
const ToastWrapper = ({ message, type, submessage }) => {
  const setNotification = useNotificationStore((state) => state.setNotification)

  useEffect(() => {
    setNotification({
      message,
      type,
      submessage,
    })
  }, [message, type, submessage])

  return <Toast />
}

const meta: Meta<typeof ToastWrapper> = {
  title: 'Dashboard/Toast',
  component: ToastWrapper,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    message: 'Your Bluesky post was published!',
    submessage: 'Take a look <a href="">here</a> →',
    type: 'info',
  },
}

export default meta
type Story = StoryObj<typeof ToastWrapper>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Operation completed successfully!',
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Your Bluesky post was published!',
    submessage: 'Take a look <a href="">here</a> →',
  },
}

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

export const WithSubmessage: Story = {
  args: {
    type: 'info',
    message: 'Main message',
    submessage: 'Click <a href="#">here</a> for more details.',
  },
}
