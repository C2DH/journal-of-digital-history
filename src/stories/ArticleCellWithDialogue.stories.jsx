import React from 'react'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'
import { QueryParamProvider } from 'use-query-params'

export default {
  title: 'ArticleCell tagged with dialogue',
  component: ArticleCell,
  argTypes: {
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const CellWithDialogue = {
  cell_type: 'markdown',
  metadata: {
    tags: ['table-border-xp-*', 'dialog-border-xp-*'],
  },
  source: [
    'Termine | Aura\n',
    '--- | ---\n',
    'so eahm to me the border it has a very familiar like  \n',
    'it’s very familiar to me because I grew up on the border with Slovenia | &nbsp;\n',
    '&nbsp; | &nbsp;\n',
    'and in fact  \n',
    'I am part of the Slovenian minority in Italy | &nbsp;\n',
    '&nbsp; | OK\n',
    'so since I was born  \n',
    'I was little  \n',
    'I always  \n',
    'with my family we always travelled from Italy to Slovenia  \n',
    'like on the regular basis daily  \n',
    'so to me the border wasn’t at the beginning  \n',
    'when when there was still like  \n',
    'the euhm physical border with the (unclear) that goes up and down  \n',
    'there was like  \n',
    'I wouldn’t call it a shock  \n',
    'because I grew up with it so I got to know it  \n',
    'but like when euhm like the the police stop you at the border and said to you  \n',
    'give me your ID give me your prekusnica  \n',
    'which was a type of passport the people who lived on the border had  \n',
    'that was quite like euhm it wasn’t normal for me  \n',
    'and then when the border was taken down  \n',
    'and now we can you can pass it whatever you like it  \n',
    'or how many times you like it  \n',
    'now it’s different but eahm  \n',
    'so as I said | &nbsp;',
  ],
}

const Template = ({ cells, metadata, isJavascriptTrusted }) => {
  const articleTree = useIpynbNotebookParagraphs({
    id: 'memoid',
    cells,
    metadata,
  })
  return (
    <QueryParamProvider>
      {articleTree.paragraphs.map((p) => (
        <ArticleCell isJavascriptTrusted={isJavascriptTrusted} key={p.idx} {...p} />
      ))}
    </QueryParamProvider>
  )
}
export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  metadata: {},
  cells: [CellWithDialogue],
}
