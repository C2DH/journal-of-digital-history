import React from 'react'
import ArticleCellRunCodeButton, {
  StatusExecuting,
  AvailableStatuses,
} from '../components/ArticleV3/ArticleCellRunCodeButton'

export default {
  title: 'ArticleCell RUN CODE button',
  component: ArticleCellRunCodeButton,
  argTypes: {
    status: {
      options: AvailableStatuses,
      control: {
        type: 'select',
        labels: AvailableStatuses,
      },
    },
    debug: { control: 'boolean' },
  },
}

const Template = (props) => {
  return (
    <div className="bg-dark p-5" style={{ height: 200 }}>
      <ArticleCellRunCodeButton {...props} />
    </div>
  )
}
export const Default = Template.bind({})

Default.args = {
  status: StatusExecuting,
  debug: false,
}
