import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import AccordeonCard from './AccordeonCard'

const meta: Meta<typeof AccordeonCard> = {
  title: 'Dashboard/AccordeonCard',
  component: AccordeonCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    title: 'Sample Accordeon Card',
    item: 'sample',
    headers: ['pid', 'title', 'status'],
    data: [
      { pid: 1, title: 'First Item', status: 'Draft' },
      { pid: 2, title: 'Second Item', status: 'Published' },
    ],
    error: undefined,
    collapsable: true,
    collapsed: false,
  },
}

export default meta
type Story = StoryObj<typeof AccordeonCard>

export const Default: Story = {}

export const WithError: Story = {
  args: {
    error: 'Something went wrong!',
  },
}
