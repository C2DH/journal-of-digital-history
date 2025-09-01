import { Meta, StoryFn } from '@storybook/react'
import SubmissionStatus from '../components/AbstractSubmissionForm/SubmissionStatus'

// Mock data for the story
const mockErrors = [
  {
    keyword: 'required',
    instancePath: '/title',
    schemaPath: '#/properties/title',
    params: { missingProperty: 'title' },
    message: 'Title is required',
  },
  {
    keyword: 'required',
    instancePath: '/abstract',
    schemaPath: '#/properties/abstract',
    params: { missingProperty: 'abstract' },
    message: 'Abstract is required',
  },
]

export default {
  title: 'Components/AbstractSubmissionForm/SubmissionStatusCard',
  component: SubmissionStatus,
  argTypes: {
    isSubmitAttempted: { control: 'boolean' },
    githubError: { control: 'text' },
    mailError: { control: 'text' },
    callForPapersError: { control: 'text' },
  },
} as Meta<typeof SubmissionStatus>

const Template: StoryFn<typeof SubmissionStatus> = (args) => <SubmissionStatus {...args} />

export const Default = Template.bind({})
Default.args = {
  errors: mockErrors,
  githubError: '',
  mailError: '',
  callForPapersError: '',
  isSubmitAttempted: false,
}

export const WithErrors = Template.bind({})
WithErrors.args = {
  errors: mockErrors,
  githubError: 'GitHub username is invalid',
  mailError: 'Email is invalid',
  callForPapersError: 'Call for papers is missing',
  isSubmitAttempted: true,
}

export const NoErrors = Template.bind({})
NoErrors.args = {
  errors: [],
  githubError: '',
  mailError: '',
  callForPapersError: '',
  isSubmitAttempted: true,
}
