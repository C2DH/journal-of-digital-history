import { createTheme } from '@mui/system'

export const theme = createTheme({
  palette: {
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
  theme.palette.blue.main,
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.green.main,
]

export const colorsPeerReviewChart = [
  theme.palette.darktolightblue.dark1,
  theme.palette.darktolightblue.dark2,
  theme.palette.darktolightblue.medium1,
  theme.palette.darktolightblue.medium2,
  theme.palette.darktolightblue.medium3,
  theme.palette.darktolightblue.light,
]

export const colorPeerReviewSimpleChart = [
  theme.palette.green.dark,
  theme.palette.darktolightblue.medium3,
  theme.palette.orange.light,
  theme.palette.gray.medium,
]

export const colorsArticle = [
  theme.palette.blue.main,
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.green.main,
  theme.palette.gray.light,
]

export const colorsAbstract = [
  theme.palette.blue.main,
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.green.main,
  theme.palette.green.dark,
  theme.palette.green.light,
]
