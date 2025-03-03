import React from 'react'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import ArticleFigure from '../models/ArticleFigure'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import ArticleCellFigure from '../components/Article/ArticleCellFigure'
import { image5 } from './fixtures/images'

// Stories for hoks and methds, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023
export default {
  title: 'ArticleCellFigure',
  component: ArticleCellFigure,
  argTypes: {
    figure: { required: true, control: { type: 'object' }, defaultValue: {} },
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const Template = ({ figure, content, outputs, metadata }) => (
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}> 
      <ArticleCellFigure figure={figure} outputs={outputs} metadata={metadata}>
        <ArticleCellContent content={content} idx={figure.idx} />
      </ArticleCellFigure>
    </QueryParamProvider>
  </BrowserRouter>
)
export const Default = Template.bind({})
export const FigureWithAspectRatio = Template.bind({})
export const Table = Template.bind({})

Table.args = {
  id: '',
  figure: new ArticleFigure({
    ref: 'table-1',
    idx: 0,
  }),
  content:
    '<table>\n<thead>\n<tr>\n<th>Year</th>\n<th>Results</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1996</td>\n<td>5</td>\n</tr>\n<tr>\n<td>1997</td>\n<td>134</td>\n</tr>\n<tr>\n<td>1998</td>\n<td>82</td>\n</tr>\n<tr>\n<td>1999</td>\n<td>326</td>\n</tr>\n<tr>\n<td>2000</td>\n<td>743</td>\n</tr>\n<tr>\n<td>2001</td>\n<td>1687</td>\n</tr>\n<tr>\n<td>2002</td>\n<td>2978</td>\n</tr>\n<tr>\n<td>2003</td>\n<td>6512</td>\n</tr>\n<tr>\n<td>2004</td>\n<td>10449</td>\n</tr>\n<tr>\n<td>2005</td>\n<td>9114</td>\n</tr>\n</tbody>\n</table>\n',
  metadata: {
    jdh: {
      object: {
        source: ["Author's search in SHINE, 14 November 2022."],
      },
    },
    tags: ['table-1', 'data-table', 'hermeneutics'],
  },
}

Default.args = {
  id: '',
  figure: new ArticleFigure({
    ref: 'figure-1',
    idx: 0,
  }),
  metadata: {
    tags: ['figure-1'],
  },
  outputs: [
    {
      data: {
        'image/jpeg':
          image5,
        'text/plain': ['<IPython.core.display.Image object>'],
      },
      metadata: {
        'image/jpeg': {
          width: 1000,
        },
        jdh: {
          module: 'object',
          object: {
            source: [
              'figure 1: Illustrations of the Kinora reel, viewer and camera © Antiq-Photo Gallery, Paris.',
            ],
            type: 'image',
          },
        },
      },
      output_type: 'display_data',
    },
  ],
  source: [
    'from IPython.display import Image, display\n',
    'metadata={\n',
    '    "jdh":{\n',
    '        "module": "object",\n',
    '        "object": {\n',
    '          "type": "image",\n',
    '           "source": [\n',
    '            "figure 1: Illustrations of the Kinora reel, viewer and camera © Antiq-Photo Gallery, Paris.",\n',
    '          ]\n',
    '        }\n',
    '    }\n',
    '}\n',
    'display(Image("media/figure1.JPG", width=1000), metadata=metadata)',
  ],
}

FigureWithAspectRatio.args = {
  ...Default.args,
  metadata: {
    tags: ['figure-1', 'aspect-ratio-600-200'],
  },
}
// WithFigure.args = {
//   id: '',
//   metadata: {},
//   cells: [
//     {
//       cell_type: 'markdown',
//       id: 'dc8ff971',
//       metadata: {
//         jdh: {
//           object: {
//             source: ["Author's search in SHINE, 14 November 2022."],
//           },
//         },
//         tags: ['table-1', 'hermeneutics'],
//       },
//       source: [
//         'Year|Results\n',
//         '---|---\n',
//         '1996|5\n',
//         '1997|134\n',
//         '1998|82\n',
//         '1999|326\n',
//         '2000|743\n',
//         '2001|1687\n',
//         '2002|2978\n',
//         '2003|6512\n',
//         '2004|10449\n',
//         '2005|9114',
//       ],
//     },
//   ],
// }
