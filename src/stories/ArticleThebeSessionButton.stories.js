import React from 'react'
import ArticleThebeSessionButton, {
  StatusIdle,
  AvailableStatuses,
} from '../components/ArticleV3/ArticleThebeSessionButton'

export default {
  title: 'ArticleV3/ArticleThebeSessionButton',
  component: ArticleThebeSessionButton,
  argTypes: {
    status: {
      options: AvailableStatuses,
      control: {
        type: 'select',
        labels: AvailableStatuses,
      },
    },
    debug: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

const Template = (props) => {
  return (
    <div className="p-5" style={{ height: 200 }}>
      <ArticleThebeSessionButton {...props} />
    </div>
  )
}

export const Default = Template.bind({})

Default.args = {
  status: StatusIdle,
  debug: false,
  disabled: false,
}
