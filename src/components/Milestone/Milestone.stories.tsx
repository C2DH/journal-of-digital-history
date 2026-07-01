import { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import Milestone from './Milestone'

const data = {
  '2020': {
    articles: [
      {
        date: '2020-12-30',
        title: 'Review of submitted abstracts',
      },
    ],
    issues: [],
    callForPapers: [
      {
        date: '2020-12-01',
        title: 'Publication of the first Call for Papers',
      },
    ],
    conferences: [],
    releases: [
      {
        date: '2020-11-30',
        title: 'Release of first public version of the platform',
      },
    ],
  },
  '2021': {
    articles: [],
    issues: [
      {
        date: '2021-09-27',
        title: '<strike>Publication of the first Issue</strike>',
      },
      {
        date: '2021-10-18',
        title: 'Publication of the first Issue',
      },
    ],
    callForPapers: [],
    conferences: [
      {
        date: '2021-11-08',
        title:
          "<a href='https://www.meshs.fr/page/dhnord2021' target='_blank'>Workshop at DH Nord, Lille</a>",
      },
    ],
    releases: [],
  },
  '2022': {
    articles: [],
    issues: [
      {
        date: '2022-04-19',
        title: 'Publication of the second Issue',
      },
    ],
    callForPapers: [],
    conferences: [
      {
        date: '2022-02-10',
        title: 'Presentation at Culture Unbound / Linköpings Universiteit',
      },
      {
        date: '2022-02-15',
        title: 'Presentation at OstData Workshop, Brussels',
      },
      {
        date: '2022-05-18',
        title: 'Pre-conference "Atelier" Humanistica 2022, Montreal',
      },
      {
        date: '2022-05-20',
        title: "Humanistica 2022: Construire une revue d'histoire à l'ère numérique",
      },
      {
        date: '2022-06-17',
        title: 'DH 2022 Tokyo Pre-Conference Lecture',
      },
      {
        date: '2022-07-25',
        title:
          "<a href='https://dh2022.adho.org/' target='_blank'>Workshop at DH2022 conference, Tokyo</a>",
      },
    ],
    releases: [],
  },
  '2024': {
    articles: [
      {
        date: '2024-03-14',
        title: 'Embedded epistemic virtue in a multi-layered article',
      },
      {
        date: '2024-09-03',
        title: 'How to decide between a variety of Public History journals?',
      },
    ],
    issues: [],
    callForPapers: [],
    conferences: [
      {
        date: '2024-04-03',
        title: 'Présentation du Journal of Digital History (TGIR Huma-Num)',
      },
    ],
    releases: [],
  },
}

const meta: Meta = {
  title: 'Components/Milestone',
  component: Milestone,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Story />
        </QueryParamProvider>
      </MemoryRouter>
    ),
  ],
  args: data,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data,
  },
}
