import React from 'react'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'

// Stories for hooks and methods, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023

export default {
  title: 'tests/Notebook with d3js',
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

  console.debug('[Article] loading articleTree paragraphs:', articleTree.paragraphs.length)

  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        {articleTree.paragraphs.map((p, i) => (
          <ArticleCell isJavascriptTrusted={isJavascriptTrusted} key={i} {...p} />
        ))}
      </QueryParamProvider>
    </BrowserRouter>
  )
}
export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  metadata: { tags: ['hidden'] },
  cells: [
    {
      cell_type: 'markdown',
      metadata: {},
      source: ['## D3 JavaScript visualisation in a Python Jupyter notebook'],
    },
    {
      cell_type: 'code',
      metadata: {},
      outputs: [
        {
          data: {
            'application/javascript': [
              'require.config({\n',
              '    paths: { \n',
              "        d3: 'https://d3js.org/d3.v5.min'\n",
              '    }\n',
              '});\n',
            ],
            'text/plain': ['<IPython.core.display.Javascript object>'],
          },
          metadata: {},
          output_type: 'display_data',
        },
      ],
      source: [
        '%%javascript\n',
        'require.config({\n',
        '    paths: { \n',
        "        d3: 'https://d3js.org/d3.v5.min'\n",
        '    }\n',
        '});',
      ],
    },
    {
      cell_type: 'code',
      metadata: {},
      outputs: [
        {
          data: {
            'application/javascript': [
              '(function(element) {\n',
              "    require(['d3'], function(d3) {   \n",
              "        d3.select(element.get(0)).append('text').text('hello world, not in a figure');\n",
              '    })\n',
              '})(element);\n',
            ],
            'text/plain': ['<IPython.core.display.Javascript object>'],
          },
          metadata: {},
          output_type: 'display_data',
        },
      ],
      source: [
        '%%javascript\n',
        '(function(element) {\n',
        "    require(['d3'], function(d3) {   \n",
        "        d3.select(element.get(0)).append('text').text('hello world, not in a figure');\n",
        '    })\n',
        '})(element);',
      ],
    },
    {
      cell_type: 'code',
      metadata: { tags: ['figure-1', 'h-500px'] },
      outputs: [
        {
          data: {
            'application/javascript': [
              '(function(element) {\n',
              "    require(['d3'], function(d3) {   \n",
              "        d3.select(element.get(0)).append('text').text('hello world as a figure');\n",
              '    })\n',
              '})(element);\n',
            ],
            'text/plain': ['<IPython.core.display.Javascript object>'],
          },
          metadata: {},
          output_type: 'display_data',
        },
      ],
      source: [
        '%%javascript\n',
        '(function(element) {\n',
        "    require(['d3'], function(d3) {   \n",
        "        d3.select(element.get(0)).append('text').text('hello world');\n",
        '    })\n',
        '})(element);',
      ],
    },
  ],
}
