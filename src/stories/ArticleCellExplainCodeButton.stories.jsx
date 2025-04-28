import React from 'react'
import ArticleCellExplainCodeButton, {
  StatusIdle,
  AvailableStatuses,
} from '../components/ArticleV3/ArticleCellExplainCodeButton'
import ArticleCellRunCodeButton from '../components/ArticleV3/ArticleCellRunCodeButton'

export default {
  title: 'ArticleV3/Cell/ExplainCodeButton',
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

const TemplateWithRunCode = (props) => {
  return (
    <div className="bg-dark p-5" style={{ minHeight: 200 }}>
      <ArticleCellRunCodeButton debug={props.debug} status={ArticleCellRunCodeButton.StatusIdle} />

      <ArticleCellExplainCodeButton className="mt-5" {...props} />
    </div>
  )
}
export const Default = Template.bind({})
export const WithRunCode = TemplateWithRunCode.bind({})

Default.args = {
  status: StatusIdle,
  debug: false,
}

TemplateWithRunCode.args = {
  status: StatusIdle,
  debug: false,
}
