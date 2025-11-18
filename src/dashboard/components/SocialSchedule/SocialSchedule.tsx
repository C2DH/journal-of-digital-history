import './SocialSchedule.css'

import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { useTranslation } from 'react-i18next'

import StaticForm from '../../../components/AbstractSubmissionForm/StaticForm'
import { theme as currentTheme } from '../../styles/theme'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Checkbox from '../Checkbox/Checkbox'
import DropdownMenu from '../DropdownMenu/DropdownMenu'

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
  const theme = createTheme(getDensePickerTheme(currentTheme.palette.mode))
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme}>
        <DateTimePicker
          label="Schedule for which time"
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
  const OnClick = (value: string) => {
    return console.log(value)
  }
  const OnCheck = (checked: boolean) => {
    return console.log(checked)
  }

  return (
    <span className="post-replies-container">
      <Checkbox checked={false} onChange={OnCheck} /> every
      <DropdownMenu
        name="number"
        options={numbers}
        value={numbers[0].value}
        onChange={OnClick}
      />{' '}
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

const handleInputChange = (event) => {}

const SocialSchedule = () => {
  const { t } = useTranslation()

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
      <FieldRow
        label="Tweets"
        value={
          <StaticForm
            id="abstract"
            label={''}
            placeholder={t('pages.abstractSubmission.placeholder.abstract')}
            required={false}
            value={'This is a test'}
            type="textarea"
            onChange={handleInputChange}
            isMissing={false}
          />
        }
      />
    </>
  )
}

export default SocialSchedule
