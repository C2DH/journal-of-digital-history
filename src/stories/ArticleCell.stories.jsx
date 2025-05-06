import React from 'react'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'
import { QueryParamProvider } from 'use-query-params'

// Stories for hooks and methods, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023
export default {
  title: 'Article/Cell/Links',
  component: ArticleCell,
  argTypes: {
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const Template = ({ cells, metadata, isJavascriptTrusted }) => {
  const articleTree = useIpynbNotebookParagraphs({
    id: 'memoid',
    cells,
    metadata,
  })
  return (
    <QueryParamProvider>
      {articleTree.paragraphs.map((p, i) => (
        <ArticleCell isJavascriptTrusted={isJavascriptTrusted} key={i} {...p} />
      ))}
    </QueryParamProvider>
  )
}
export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  metadata: {},
  cells: [
    {
      cell_type: 'markdown',
      metadata: {
        tags: ['narrative'],
      },
      source: [
        'Markdown links must always be [external Tieghemella](https://en.wikipedia.org/wiki/Tieghemella)\n',
        '\n',
        'This is a simple example of a notebook with external links.\n',
        '\n',
      ],
    },
  ],
}
