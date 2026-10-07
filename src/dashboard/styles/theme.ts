import { createTheme } from '@mui/system'

export const theme = createTheme({
  palette: {
    workflow: {
      writing: '#0072B2',
      technical_review: '#56B4E9',
      peer_review: '#332288',
      design_review: '#44AA99',
      copyediting: '#CC79A7',
      social_media: '#F0E442',
      published: '#DEDAF8',
      rejected: '#A9A9A9',
    },
    peer_review: {
      submitted: '#D8DBFF',
      in_progress: '#9193F0',
      finished: '#332288',
      delayed: '#F5A55A',
      declined: '#A9A9A9',
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
  theme.palette.peer_review.submitted,
  theme.palette.peer_review.in_progress,
  theme.palette.peer_review.delayed,
  theme.palette.peer_review.declined,
  theme.palette.peer_review.finished,
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
