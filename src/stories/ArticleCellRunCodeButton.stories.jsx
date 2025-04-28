import React from 'react'
import ArticleCellRunCodeButton, {
  StatusExecuting,
  AvailableStatuses,
} from '../components/ArticleV3/ArticleCellRunCodeButton'
import ArticleCellExplainCodeButton from '../components/ArticleV3/ArticleCellExplainCodeButton'

export default {
  title: 'ArticleV3/Cell/RunCodeButton',
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
    disabled: { control: 'boolean' },
  },
}

const Template = (props) => {
  return (
    <div className="bg-dark p-5" style={{ height: 200 }}>
      <ArticleCellRunCodeButton {...props} />
    </div>
  )
}

const TemplateWithExplainCode = (props) => {
  return (
    <div className="bg-dark p-5" style={{ height: 200 }}>
      <ArticleCellRunCodeButton {...props} />
      <ArticleCellExplainCodeButton
        className="mt-5"
        debug={props.debug}
        status={ArticleCellExplainCodeButton.StatusIdle}
      />
    </div>
  )
}
export const Default = Template.bind({})
export const WithExplainCode = TemplateWithExplainCode.bind({})

Default.args = {
  status: StatusExecuting,
  debug: false,
  disabled: false,
}

WithExplainCode.args = {
  status: StatusExecuting,
  debug: false,
  disabled: false,
}
