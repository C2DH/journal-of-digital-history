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
    callForPapers: [],
    conferences: [
      {
        date: '2024-04-03',
        title: 'Présentation du Journal of Digital History (TGIR Huma-Num)',
      },
    ],
    releases: [],
  },
  '2025': {
    articles: [
      {
        date: '2025-01-06',
        title:
          'Voyages in 3D: Creating a Multimodal Narrative of the Battle of Mount Street Bridge',
        issue: 3,
      },
      {
        date: '2025-01-15',
        title: 'Time: the Cost of Reproducibility',
        issue: 4,
      },
      {
        date: '2025-01-27',
        title: 'Chinese Political and Cultural Elites: Twentieth Century Transformations',
        issue: 5,
      },
      {
        date: '2025-03-13',
        title:
          'Simulating and visualising data in environmental history: Airborne dust concentration from the Belval plant in Luxembourg (1911-1997)',
        issue: 4,
      },
      {
        date: '2025-03-20',
        title:
          'Chronoferencing the Italian-Slovenian Borderlands. Citizen Science, Oral History and Output Criticism',
        issue: 4,
      },
      {
        date: '2025-05-05',
        title:
          'In search of an interpretative environment for digital traces: the building of Arvest',
        issue: 3,
      },
      {
        date: '2025-06-18',
        title: 'The Text Analysis Prototype for Galileo’s Library and Letters Online: GaLiLeO',
        issue: 3,
      },
      {
        date: '2025-06-19',
        title: 'Contextualizing and unlocking political web defacements for research',
      },
      {
        date: '2025-06-19',
        title:
          '‘Thanks for the moan!’ Disillusionment with the British sickness system, online and in print, 1997–2005',
      },
      {
        date: '2025-01-27',
        title: 'Chinese Political and Cultural Elites: Twentieth Century Transformations',
      },
      {
        date: '2025-01-27',
        title: 'Chinese Political and Cultural Elites: Twentieth Century Transformations',
      },
    ],
    callForPapers: [
      {
        date: '2025-05-31',
        title: 'AI & History - Deadline for submitting abstracts',
      },
      {
        date: '2025-06-15',
        title: 'AI & History - Notification of abstract acceptance',
      },
    ],
    conferences: [
      {
        date: '2025-06-15',
        title: 'AI through History, History through AI',
      },
    ],
    releases: [
      {
        date: '2025-06-25',
        title: 'Aquamarine v5',
      },
    ],
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
