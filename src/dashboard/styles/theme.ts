import { createTheme } from '@mui/system'

export const theme = createTheme({
  palette: {
    primary: {
      dark: '#4527a0',
      main: '#6366F1',
      light: '#b39ddb',
    },
    secondary: {
      dark: '#00695c',
      main: '#2DD4BF',
      light: '#80cbc4',
    },
    published: {
      dark: '#37474f',
      main: '#607d8b',
      light: '#E0E0E0',
    },
  },
})

export const colorsPieChart = [
  theme.palette.primary.main,
  theme.palette.primary.dark,
  theme.palette.primary.light,
  theme.palette.secondary.main,
]
