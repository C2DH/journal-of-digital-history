import './SocialSchedule.css'

import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'

import type {} from '@mui/x-data-grid/themeAugmentation'
import { theme as currentTheme } from '../../styles/theme'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Checkbox from '../Checkbox/Checkbox'
import DropdownMenu from '../DropdownMenu/DropdownMenu'

export const gray = {
  50: 'hsl(220, 60%, 99%)',
  100: 'hsl(220, 35%, 94%)',
  200: 'hsl(220, 35%, 88%)',
  300: 'hsl(220, 25%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 25%, 35%)',
  700: 'hsl(220, 25%, 25%)',
  800: 'hsl(220, 25%, 10%)',
  900: 'hsl(220, 30%, 5%)',
}

type PaletteMode = 'light' | 'dark'

const getDensePickerTheme = (mode: PaletteMode): ThemeOptions => ({
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

const Schedule = () => {
  // const theme = createTheme(currentTheme.palette.gray)
  const theme = createTheme(getDensePickerTheme(currentTheme.palette.mode))
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme}>
        <DateTimePicker
          label="Bluesky time"
          name="startDateTime"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
            },
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

const OnClick = (value: string) => {
  return console.log(value)
}

const PostReplies = () => {
  const numbers = [
    { key: 1, value: '1', label: '1' },
    { key: 2, value: '2', label: '2' },
    { key: 3, value: '3', label: '3' },
  ]

  const timeUnit = [
    { key: 1, value: 'hours', label: 'hours' },
    { key: 2, value: 'minutes', label: 'minutes' },
  ]

  return (
    <span className="post-replies-container">
      <Checkbox /> every{' '}
      <DropdownMenu name="number" options={numbers} value={numbers[0].value} onChange={OnClick} />{' '}
      <DropdownMenu
        name="time-unit"
        options={timeUnit}
        value={timeUnit[0].value}
        onChange={OnClick}
      />
    </span>
  )
}

export const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fieldrow">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

const SocialSchedule = () => {
  return (
    <>
      {' '}
      <FieldRow label="Bluesky" value="@jdighist.bsky.social" />
      <FieldRow
        label="Tweet link"
        value={
          <LinkButton url="https://github.com/jdh-observer/BHmHNQKJaSWT/blob/main/tweets.md" />
        }
      />
      <FieldRow label="Time" value={<Schedule />} />
      <FieldRow label="Post replies" value={<PostReplies />} />
      <FieldRow label="Tweets" value={<textarea />} />
    </>
  )
}

export default SocialSchedule
