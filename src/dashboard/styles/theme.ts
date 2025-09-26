import { createTheme } from '@mui/system'

export const theme = createTheme({
  palette: {
    blue: {
      dark: '#4338CA',
      main: '#3B82F6',
      light: '#38BDF8',
    },
    green: {
      dark: '#14B8A6',
      main: '#5EEAD4',
      light: '#A7F3F0',
    },
    gray: {
      dark: '#37474f',
      main: '#607d8b',
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

export const colorsBarChart = [
  theme.palette.blue.main,
  theme.palette.blue.dark,
  theme.palette.blue.light,
  theme.palette.green.dark,
  theme.palette.gray.light,
]
