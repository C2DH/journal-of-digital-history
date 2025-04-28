import React from 'react'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import ArticleToC from '../components/ArticleV3/ArticleToC'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { image3, image4 } from './fixtures/images'

export default {
  title: 'ArticleV3/Table of Contents',
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
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <div className="w-100 d-flex">
          <ArticleToC
            width={100}
            paragraphs={articleTree.paragraphs}
            headingsPositions={articleTree.headingsPositions}
          ></ArticleToC>
        </div>
      </QueryParamProvider>
    </BrowserRouter>
  )
}

export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  cells: [
    {
      cell_type: 'markdown',
      metadata: {
        jdh: {
          section: 'title',
        },
      },
      source: ['#  How to use Cell Metadata to Ship Article Basic Metadata'],
    },
    {
      cell_type: 'markdown',
      metadata: {
        jdh: {
          section: 'abstract',
        },
      },
      source: [
        'The Journal relies heavily on **cell metadata** to correctly display its structure. A cell metadata is a simple JSON object attached to each cell. To change its properties go to `View -> Cell Toolbar -> Edit Metadata` in the Jupyter Notebook Toolbar and a button will appear above each cell.\n',
        'For instance, to format the article title, just add `{"jdh":{"section":"title"}}` to the cell metadata. ',
      ],
    },
    {
      cell_type: 'markdown',
      metadata: {
        jdh: {
          section: 'abstract',
        },
      },
      source: [
        'This is the article **abstract** and contains *markdown* text. It can be composed by different paragraphs splitted in different *cells*.\n',
        'Just add `{"jdh":{"section":"abstract"}}` to each cell metadata section.\n',
        'To compose the **contibutors** section below, in addition to the metadata `{"jdh":{"section":"contributor"}}` the person name should appear as `h3` heading, in markdown add three hashes ### ',
      ],
    },
    {
      cell_type: 'markdown',
      metadata: {
        jdh: {
          section: 'contributor',
        },
      },
      source: ['### Frédéric Clavert\n', 'University of Luxembourg'],
    },
    {
      cell_type: 'markdown',
      metadata: {
        jdh: {
          section: 'contributor',
        },
      },
      source: [
        '### Ernest Miller Hemingway\n',
        'Ernest Miller Hemingway (July 21, 1899 – July 2, 1961) was an American novelist, short-story writer, journalist, and sportsman',
      ],
    },
    {
      cell_type: 'code',
      execution_count: 2,
      metadata: {},
      outputs: [
        {
          name: 'stdout',
          output_type: 'stream',
          text: ['test\n'],
        },
      ],
      source: ["print('test')"],
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [],
    },
    {
      cell_type: 'markdown',
      source: ['## Introduction'],
      metadata: {},
      outputs: [],
    },
    {
      cell_type: 'code',
      execution_count: 103,
      metadata: {
        jdh: {
          module: 'object',
          object: {
            source: ['figure 1: Distribution of the lexemes in Tacitus'],
            type: 'image',
          },
        },
        tags: [
          'narrative',
          'hermeneutics',
          'figure-1',
          'aspect-ratio-856-481',
          'h-481px',
          'w-856px',
        ],
      },
      outputs: [
        {
          data: {
            'text/markdown': [
              'There are __186 occurrences__ of the three main lexemes of the crowd in Tacitus: __123 occurrences__ of _vulgus_ (66.13%), __45 occurrences__ of _multitudo_ (24.19%) and __18 occurrences__ of _turba_ (9.68%).',
            ],
            'text/plain': ['<IPython.core.display.Markdown object>'],
          },
          metadata: {},
          output_type: 'display_data',
        },
        {
          data: {
            'text/plain': ["Text(0.5,1,'figure 1: Distribution of the lexemes in Tacitus')"],
          },
          execution_count: 103,
          metadata: {},
          output_type: 'execute_result',
        },
        {
          data: {
            'image/png': image3,
            'text/plain': ['<IPython.core.display.Image object>'],
          },
          metadata: {
            jdh: {
              module: 'object',
              object: {
                source: ['Process of creating an article in the Journal of Digital History'],
                type: 'image',
              },
            },
          },
          output_type: 'display_data',
        },
      ],

      source: [
        'from IPython.display import Image \n',
        'metadata={\n',
        '    "jdh": {\n',
        '        "module": "object",\n',
        '        "object": {\n',
        '            "type":"image",\n',
        '            "source": [\n',
        '                "Website: Docker Desktop installation for Windows"\n',
        '            ]\n',
        '        }\n',
        '    }\n',
        '}\n',
        'display(Image("media/Docker_Desktop3.png"), metadata=metadata)',
      ],
    },

    {
      cell_type: 'markdown',
      source: ['## First Section'],
      metadata: {},
      outputs: [],
    },
    {
      cell_type: 'code',
      execution_count: 111,
      metadata: {
        jdh: {
          module: 'object',
          object: {
            source: ['figure 5: Distribution according to the morphological analysis'],
            type: 'image',
          },
        },
        scrolled: true,
        tags: [
          'narrative',
          'hermeneutics',
          'figure-5',
          'aspect-ratio-1074-360',
          'h-360px',
          'w-1074px',
        ],
      },
      outputs: [
        {
          data: {
            'text/plain': [
              "Text(0.5,0.98,'figure 5: Distribution according to the morphological analysis')",
            ],
          },
          execution_count: 111,
          metadata: {},
          output_type: 'execute_result',
        },
        {
          data: {
            'image/png': image4,
            'text/plain': ['<Figure size 1080x360 with 3 Axes>'],
          },
          metadata: {},
          output_type: 'display_data',
        },
      ],
      source: [
        '# Extraction of the morphological case from the LEMLAT code\n',
        'noms_foule_df_morph = noms_foule_df.copy()\n',
        '\n',
        'cases = {"n":"nominative", \n',
        '        "a":"accusative", \n',
        '        "g":"genitive", \n',
        '        "b":"ablative", \n',
        '        "d":"dative"}\n',
        '\n',
        'for index, row in noms_foule_df_morph.iterrows():\n',
        '    noms_foule_df_morph.at[index, "morph"] = cases[noms_foule_df_morph.at[index, "morph"][5]]\n',
        '\n',
        'fig5 = sns.displot(noms_foule_df_morph, x="morph", col="lemma", multiple="dodge")\n',
        'fig5.set_axis_labels("Morphological tag", "Occurrences", labelpad=10)\n',
        'plt.gcf().suptitle("figure 5: Distribution according to the morphological analysis")',
      ],
    },
    {
      cell_type: 'markdown',
      source: ['## Second Section'],
      metadata: {},
      outputs: [],
    },
  ],
  metadata: {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3',
    },
    language_info: {
      codemirror_mode: {
        name: 'ipython',
        version: 3,
      },
      file_extension: '.py',
      mimetype: 'text/x-python',
      name: 'python',
      nbconvert_exporter: 'python',
      pygments_lexer: 'ipython3',
      version: '3.8.0',
    },
  },
}
