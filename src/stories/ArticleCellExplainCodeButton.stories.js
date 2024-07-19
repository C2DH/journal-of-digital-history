import React from 'react'
import ArticleCellExplainCodeButton, {
  StatusIdle,
  AvailableStatuses,
} from '../components/ArticleV3/ArticleCellExplainCodeButton'

export default {
  title: 'ArticleCell EXPLAIN CODE button',
  component: ArticleCellExplainCodeButton,
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
      <ArticleCellExplainCodeButton {...props} />
    </div>
  )
}
export const Default = Template.bind({})

Default.args = {
  status: StatusIdle,
  debug: false,
}
