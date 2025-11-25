import { ThemeOptions } from '@mui/material/styles'

type PaletteMode = 'light' | 'dark'
export const getDensePickerTheme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      light: 'hsl(240, 83%, 88%)',
      main: 'hsl(240, 83%, 65%)',
      dark: 'hsl(240, 78%, 43%)',
      contrastText: '#fff',
      ...(mode === 'dark' && {
        contrastText: 'hsl(240, 82%, 97%)',
        light: 'hsl(240, 83%, 80%)',
        main: 'hsl(240, 83%, 70%)',
        dark: 'hsl(240, 78%, 35%)',
      }),
    },
  },
})
