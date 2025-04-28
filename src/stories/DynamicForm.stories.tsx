import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DynamicForm from '../components/AbstractSubmissionForm/DynamicForm'
import { DynamicFormItem } from '../interfaces/abstractSubmission'

export default {
  title: 'Components/AbstractSubmissionForm/DynamicForm',
  component: DynamicForm,
  argTypes: {
    maxItems: { control: 'number', defaultValue: 5, description: 'Maximum number of items allowed' },
    buttonLabel: { control: 'text', defaultValue: 'addItem', description: 'Label for the add button' },
    title: { control: 'text', description: 'Title of the form' },
    explanation: { control: 'text', description: 'Explanation text for the form' },
    fieldConfig: { control: 'object', description: 'Configuration for form fields' },
    items: { control: 'object', description: 'Initial items in the form' },
  },
} as Meta<typeof DynamicForm>

const Template: StoryFn<typeof DynamicForm> = (args) => {
  const [items, setItems] = useState<DynamicFormItem[]>(args.items || [])

  const handleAdd = () => {
    if (items.length < (args.maxItems || 5)) {
      setItems([...items, {}])
    }
  }

  const handleRemove = (index: number) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
  }

  const handleChange = (index: number, fieldname: string, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [fieldname]: value }
    setItems(updatedItems)
  }

  return (
    <DynamicForm
      {...args}
      items={items}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onChange={handleChange}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'dynamicForm',
  title: 'Dynamic Form Example',
  explanation: 'This is an example of a dynamic form for the authors.',
  buttonLabel: 'addAuthor',
  fieldConfig: [
    {
      label: 'author.firstname',
      fieldname: 'firstname',
      type: 'text',
      placeholder: 'firstname',
      required: true,
    },
    {
      label: 'author.lastname',
      fieldname: 'lastname',
      type: 'textarea',
      placeholder: 'lastname',
      required: false,
    },
    {
      label: 'author.primaryContact',
      fieldname: 'primaryContact',
      type: 'checkbox',
      required: false,
    },
  ],
  items: [
    { firstname: 'First name1', lastname:'Last name 1', primaryContact: true },
    { title: 'First name 2', description: 'Last name 2', primaryContact: false },
  ],
  maxItems: 5,
  errors: [],
  confirmEmailError: '',
  confirmGithubError: '',
  missingFields: {},
}