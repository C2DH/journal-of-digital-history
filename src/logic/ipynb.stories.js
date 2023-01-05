import React from 'react'
import { getArticleTreeFromIpynb } from './ipynb'

// Stories for hoks and methds, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023
const Component = ({ id, cells, metadata }) => {
  const tree = getArticleTreeFromIpynb({
    id,
    cells,
    metadata,
  })

  return (
    <pre>
      <code>id: {id}</code>
      <h2>headings: {tree.headings.length}</h2>
      <ul>
        {tree.headings.map((h, i) => (
          <li key={i}>
            <pre>{JSON.stringify(h, null, 2)}</pre>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </pre>
  )
}

export default {
  title: 'Ipynb parser',
  component: Component,
  argTypes: {
    id: {
      required: false,
      control: { type: 'text' },
      description: 'Optional. This could be the absolute url of the ipynb, for sanity check.',
      table: {
        type: { summary: 'url' },
      },
      defaultValue: '',
    },
    cells: { control: { type: 'object' }, defaultValue: [] },
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const Template = (args) => <Component {...args} />
export const Default = Template.bind({})
Default.args = {
  id: '',
  metadata: {},
  cells: [
    {
      cell_type: 'markdown',
      id: '0107eafc',
      metadata: {
        tags: ['title'],
      },
      source: ['# a nice title for the Article'],
    },
    {
      cell_type: 'markdown',
      id: '91eb58b1',
      metadata: {},
      source: [
        'cc-by ©. Published by De Gruyter in cooperation with the University of Luxembourg Centre for Contemporary and Digital History. This is an Open Access article distributed under the terms of the Creative Commons Attribution License CC-BY\n',
      ],
    },
    {
      cell_type: 'markdown',
      id: '9460d8c1',
      metadata: {
        tags: ['keywords'],
      },
      source: ['Tag1, Tag2, Tag3'],
    },
    {
      cell_type: 'markdown',
      id: '68337d47',
      metadata: {
        tags: ['abstract'],
      },
      source: ['First paragraph;', 'Second paragraph.'],
    },
    {
      cell_type: 'markdown',
      id: '5e5bd2f1',
      metadata: {},
      source: [
        '## Context and definitions\n',
        'First paragraph;\n',
        '\n',
        '>[hacktivism is defined as] the nonviolent use of illegal or legally ambiguous digital tools in pursuit of political ends. These tools include web site defacements, redirects, denial-of-service attacks, information theft, web site parodies, virtual sit-ins, virtual sabotage, and software development. (<cite data-cite="1878900/W9UM4VQS"></cite>) \n',
        '\n',
        'Another Paragraph.\n',
      ],
    },
    {
      cell_type: 'markdown',
      id: '5c74e392',
      metadata: {},
      source: ['### Data sources\n'],
    },
  ],
}
