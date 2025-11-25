import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'

import { theme as currentTheme } from '../../../styles/theme'
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

const Schedule = ({ onChange }) => {
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
          name="startDateTime"
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
            onChange(value?.toISO())
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default Schedule
