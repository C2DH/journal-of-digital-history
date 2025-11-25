import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { DateTime } from 'luxon'

import { theme as currentTheme } from '../../../styles/theme'
import { Frequency } from '../interface'
import { getDensePickerTheme } from './calendarTheme'

const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
  '& .MuiPickersInputBase-root': {
    backgroundColor: 'var(--color-accent-lighter)',
    borderRadius: '16px',
    color: 'var(--color-deep-blue)',
  },
  '& .MuiFormLabel-root ': {
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--color-deep-blue)',
  },
  '& .MuiPickersSectionList-root ': {
    fontFamily: "'DM Sans', sans-serif",
  },
  '& .MuiButtonBase-root': {
    color: 'var(--color-deep-blue)',
    opacity: 0.8,
  },
  '& .MuiPickersOutlinedInput-notchedOutline': {
    border: 'none',
  },
}))

const newDate = (time: string, frequency: Frequency): string => {
  return (
    DateTime.fromISO(time)
      .plus({ [frequency['timeUnit']]: parseInt(frequency['timeGap']) })
      .toISO() || ''
  )
}

const createTimeSchedule = (
  initialTime: string,
  frequency: Frequency,
  numberTweets: number,
): string[] => {
  if (!initialTime || !frequency) return ['']
  if (frequency['timeGap'] === '-' && frequency['timeUnit'] === '-') return [initialTime]

  const array: string[] = []

  for (let i = 0; i < numberTweets; i++) {
    console.log('Creating time schedule...')
    if (i === 0) {
      array.push(initialTime)
    } else {
      array.push(newDate(array[i - 1], frequency))
    }
  }

  return array
}

const Schedule = ({ frequency, numberTweets, onChange }) => {
  const theme = createTheme({
    ...getDensePickerTheme(currentTheme.palette.mode),
    components: {
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: 'var(--color-accent)',
          },
        },
      },
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme}>
        <StyledDateTimePicker
          label="Schedule for which time"
          name="schedule_main"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          disablePast
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
            },
          }}
          onChange={(value) => {
            const newDate = createTimeSchedule(value?.toISO() ?? '', frequency, numberTweets)
            return onChange(newDate)
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default Schedule
