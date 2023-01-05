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
      <h3>warnings: {tree.warnings.length}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>cell index</th>
            <th>code</th>
            <th>message</th>
            <th>original ipynb cell</th>
          </tr>
        </thead>
        <tbody>
          {tree.warnings.map((d, i) => (
            <tr key={i}>
              <td>{d.idx}</td>
              <td>{d.code}</td>
              <td>
                <pre>{d.message}</pre>
              </td>
              <td>
                <pre>{JSON.stringify(cells[d.idx], null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>headings: {tree.headings.length}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>cell index</th>
            <th>level</th>
            <th>content</th>
            <th>original ipynb cell</th>
          </tr>
        </thead>
        <tbody>
          {tree.headings.map((h, i) => (
            <tr key={i}>
              <td>{h.idx}</td>
              <td>{h.tag}</td>
              <td>{h.content}</td>
              <td>
                <pre>{JSON.stringify(cells[h.idx], null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>paragraphs: {tree.paragraphs.length}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>cell index</th>
            <th>level</th>
            <th>original ipynb cell</th>
          </tr>
        </thead>
        <tbody>
          {tree.paragraphs.map((h, i) => (
            <tr key={i}>
              <td>{h.idx}</td>
              <td>{JSON.stringify(h, null, 2)}</td>
              <td>
                <pre>{JSON.stringify(cells[h.idx], null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </pre>
  )
}

export default {
  title: 'logic/Ipynb parser',
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
export const WithWarnings = Template.bind({})
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
        '>hacktivism is defined as the nonviolent use of illegal or legally ambiguous digital tools in pursuit of political ends. These tools include web site defacements, redirects, denial-of-service attacks, information theft, web site parodies, virtual sit-ins, virtual sabotage, and software development. \n',
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

WithWarnings.args = {
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
      id: '5e5bd2f1',
      metadata: {},
      source: [
        '## Context and definitions\n',
        'First paragraph;\n',
        '\n',
        '> [hacktivism is defined] as the nonviolent use of illegal or legally ambiguous digital tools in pursuit of political ends. These tools include web site defacements, redirects, denial-of-service attacks, information theft, web site parodies, virtual sit-ins, virtual sabotage, and software development. (<cite data-cite="1878900/W9UM4VQS"></cite>) \n',
        '\n',
        'Another Paragraph.\n',
      ],
    },
  ],
}
