import React from 'react'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'
import { QueryParamProvider } from 'use-query-params'

// Stories for hoks and methds, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023
export default {
  title: 'ArticleCell with figure captions',
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
      cell_type: 'code',
      execution_count: 10,
      id: '34dca578',
      metadata: {
        execution: {
          'iopub.execute_input': '2023-04-18T15:05:44.471501Z',
          'iopub.status.busy': '2023-04-18T15:05:44.470499Z',
          'iopub.status.idle': '2023-04-18T15:05:44.481465Z',
          'shell.execute_reply': '2023-04-18T15:05:44.482090Z',
        },
        jdh: {
          module: 'object',
          object: {
            source: [
              'figure 6: very important and less important actors in the news world underlying the MIA-Euronews Corpus. The size of the bubbles is adjusted according to the stationary probability of each word. Bubbles coloured blue contain those terms the stationary probability of which is above the upper quartile (75%); bubbles coloured orange include terms the stationary probability of which is between the median (50%)  and the upper quartile (75%).',
            ],
            type: 'image',
          },
        },
        tags: ['figure-6'],
      },
      outputs: [
        {
          data: {
            'image/png': import.meta.env.VITE_STORYBOOK_BASE_64_PNG_SRC,
            'text/plain': ['<IPython.core.display.Image object>'],
          },
          execution_count: 10,
          metadata: {
            'image/png': {
              width: 800,
            },
          },
          output_type: 'execute_result',
        },
      ],
      source: ["Image('media/image12.png',width=800)"],
    },
  ],
}
