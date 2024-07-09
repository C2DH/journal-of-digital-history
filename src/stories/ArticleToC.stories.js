import React from 'react'
import ArticleToC from '../components/ArticleV3/ArticleToC'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'

export default {
  title: 'v3/Table of Contents for V3',
  component: ArticleToC,
  argTypes: {
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const Template = ({ cells, metadata }) => {
  const articleTree = useIpynbNotebookParagraphs({
    id: 'memoid',
    cells,
    metadata,
  })
  return (
    <div className="w-100 d-flex">
      <ArticleToC width={100} cells={articleTree.cells}></ArticleToC>
      <div>
        {articleTree.paragraphs.map((p, i) => (
          <div key={i}>{p.text}</div>
        ))}
      </div>
    </div>
  )
}

export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  metadata: {},
  cells: [],
}
