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
    abstracts: {
      published: '#DEDAF8',
      accepted: '#5DA6DF',
      submitted: '#9193F0',
      suspended: '#A9A9A9',
      abandoned: '#A9A9A9',
      declined: '#A9A9A9',
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
  theme.palette.abstracts.published,
  theme.palette.abstracts.accepted,
  theme.palette.abstracts.submitted,
  theme.palette.abstracts.suspended,
  theme.palette.abstracts.abandoned,
  theme.palette.abstracts.declined,
]
