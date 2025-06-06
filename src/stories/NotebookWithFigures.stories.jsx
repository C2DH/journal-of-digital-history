import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'

import { image1, image2 } from './fixtures/images'

// Stories for hooks and methods, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023

export default {
  title: 'tests/Notebook with figures',
  component: ArticleCell,
  argTypes: {
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Story />
        </QueryParamProvider>
      </BrowserRouter>
    ),
  ],
}

const Template = ({ cells, metadata }) => {
  const articleTree = useIpynbNotebookParagraphs({
    id: 'memoid',
    cells,
    metadata,
  })

  console.debug('[Article] loading articleTree paragraphs:', articleTree.paragraphs.length)

  return (
    <>
      {articleTree.paragraphs.map((p, i) => (
        <ArticleCell key={i} {...p} />
      ))}
    </>
  )
}

export const Default = Template.bind({})

Default.args = {
  metadata: {},
  cells: [
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
            'image/png': image1,
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
            'image/png': image2,
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
  ],
}
