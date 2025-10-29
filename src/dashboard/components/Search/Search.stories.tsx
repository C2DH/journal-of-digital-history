import { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import Search from './Search'
import './Search.css'

const meta: Meta<typeof Search> = {
  title: 'Dashboard/Search',
  component: Search,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    placeholder: 'Search...',
  },
}

export default meta
type Story = StoryObj<typeof Search>
export const Default: Story = {}
