import { createTheme } from '@mui/system'

export const theme = createTheme({
  palette: {
    workflow: {
      writing: '#3C1A78',
      technical_review: '#5E2BFF',
      peer_review: '#174696',
      design_review: '#1A9E7F',
      copyediting: '#007E86',
      social_media: '#51F6E0',
      published: '#E0E0E0',
      rejected: '#B7B7B7',
    },
    peer_review: {
      submitted: '#A8CCF2',
      in_progress: '#558CD6',
      finished: '#13428C',
      delayed: '#F5A857',
      declined: '#B7B7B7',
    },
    blue: {
      dark: '#4338CA',
      main: '#3B82F6',
      light: '#38BDF8',
    },
    lightblue: {
      dark: '#38BDF8',
      medium1: '#5CC9F9',
      medium2: '#7FD5FB',
      medium3: '#A3E1FC',
      light: '#C6EDFE',
    },
    darktolightblue: {
      dark1: '#2B3674',
      dark2: '#2E518E',
      medium1: '#306CA9',
      medium2: '#3387C3',
      medium3: '#35A2DE',
      light: '#38BDF8',
    },
    orange: {
      light: '#FFA86A',
    },
    green: {
      dark: '#14B8A6',
      main: '#5EEAD4',
      light: '#A7F3F0',
    },
    gray: {
      dark: '#37474f',
      main: '#607d8b',
      medium: '#A0AFB6',
      light: '#E0E0E0',
    },
  },
})

export const colorsPieChart = [
  theme.palette.workflow.writing,
  theme.palette.workflow.technical_review,
  theme.palette.workflow.peer_review,
  theme.palette.workflow.copyediting,
  theme.palette.workflow.design_review,
]

export const colorPeerReviewChart = [
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.orange.light,
  theme.palette.gray.light,
  theme.palette.green.light,
]

export const colorsArticle = [
  theme.palette.workflow.writing,
  theme.palette.workflow.technical_review,
  theme.palette.workflow.peer_review,
  theme.palette.workflow.copyediting,
  theme.palette.workflow.design_review,
  theme.palette.workflow.published,
  theme.palette.workflow.rejected,
]

export const colorsAbstract = [
  theme.palette.blue.main,
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.green.main,
  theme.palette.green.dark,
  theme.palette.green.light,
]
