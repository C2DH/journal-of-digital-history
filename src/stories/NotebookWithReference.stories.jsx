// import { Meta, StoryFn } from '@storybook/react'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb.js'
import ArticleCell from '../components/Article/ArticleCell.jsx'

// Stories for hooks and methods, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023

export default {
  title: 'tests/Notebook with reference',
  component: ArticleCell,
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

  console.debug('[Article] loading articleTree paragraphs:', articleTree.paragraphs.length)

  return <>{articleTree.paragraphs.map((p) => <ArticleCell key={p.id} {...p} />)}</>
}

export const Default = Template.bind({})

Default.args = {
  metadata: {
    celltoolbar: 'Tags',
    cite2c: {
      citations: {
        '3655479/4RB6A474': {
          DOI: '10.1111/j.1468-2435.1979.tb00844.x',
          URL: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1468-2435.1979.tb00844.x',
          accessed: {
            'date-parts': [[2022, 3, 4]],
          },
          author: [
            {
              family: 'International Migration',
              given: '',
            },
          ],
          'container-title': 'International Migration',
          issue: '1-2',
          issued: {
            'date-parts': [[1979, 1, 4]],
          },
          language: 'en',
          page: '7-12',
          title: 'Introduction',
          type: 'article-journal',
          volume: '17',
        },
      },
    },
  },
  cells: [
    {
      cell_type: 'markdown',
      metadata: {
        tags: ['narrative'],
      },
      source: [
        'It is remarkable that there is only an explicit call for statistical research. When in 1979 the topic of the Seminar was the adaptation of child migrants, the Seminar concluded that “scientific analysis and research in the field of the socio-psychology of the children of migrants has produced a whole range of very divergent data.” (<cite data-cite="3655479/4RB6A474"></cite>) and that “There was a strong feeling that the results of this research are badly in need of being integrated and collated.” But immediately following this, the Seminar warned that “considering that the socialization problems of migrant children in the host country are conditioned by their economic, social and legal status in that country, the Seminar has drawn attention to the dangers of an excessive intrusion of psychology into the problems of the children of migrants.” This is the only instance when another field of research than statistics or demography was mentioned. \n',
      ],
    },
  ],
}