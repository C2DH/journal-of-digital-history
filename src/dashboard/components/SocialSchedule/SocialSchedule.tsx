import './SocialSchedule.css'

import { Textarea, Typography } from '@mui/joy'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ChangeEvent, useEffect, useState } from 'react'

import { Frequency, SocialScheduleProps } from './interface'

import { getErrorByFieldAndByIndex } from '../../../logic/errors'
import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'
import { theme as currentTheme } from '../../styles/theme'
import { getTweetContent } from '../../utils/api/api'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Checkbox from '../Checkbox/Checkbox'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getDensePickerTheme } from './calendarTheme'
import { timeGapHour, timeGapMinute, timeUnits } from './constant'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const cleanThreadContent = (raw: string): string[] => {
  if (!raw) return []

  const lines = raw.replace(/\r/g, '').split('\n')
  const threadTexts: string[] = []
  const independent: string[] = []
  let mode: 'thread' | 'independent' | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    // "Post thread:" header
    if (/^Post thread:/i.test(line)) {
      mode = 'thread'
      continue
    }

    // Line number 1., 2., 3. etc...
    if (mode === 'thread') {
      const m = line.match(/^\d+\.\s*(.*)$/)
      if (m) {
        threadTexts.push(m[1].trim())
        continue
      }
      threadTexts.push(line.replace(/^\d+\.\s*/, '').trim())
      continue
    }

    // Independent bullet items
    if (line.startsWith('-')) {
      mode = 'independent'
      independent.push(line.replace(/^-+\s*/, '').trim())
      continue
    }

    // If no header but line is numbered, treat it as thread
    if (/^\d+\.\s*/.test(line)) {
      mode = 'thread'
      threadTexts.push(line.replace(/^\d+\.\s*/, '').trim())
      continue
    }

    // Fallback: treat plain lines as independent items
    independent.push(line)
  }

  // Return combined list: thread first, then independent
  return [...threadTexts, ...independent]
}

export const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fieldrow">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

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
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [frequency, setFrequency] = useState<Frequency>({
    timeGap: timeGapHour[0].value,
    timeUnit: timeUnits[0].value,
  })
  const [timeUnit, setTimeUnit] = useState<string>('')
  const [timeGap, setTimeGap] = useState<string>('-')

  const ActivatePostReplies = () => {
    setIsChecked(!isChecked)
  }
  const HandleFrequencySelection = (type: string, value: string) => {
    if (type === 'timeGap') {
      setFrequency({ ...frequency, timeGap: value.toString() })
      setTimeGap(value.toString())
    }
    if (type === 'timeUnit') {
      setFrequency({ ...frequency, timeUnit: value.toString() })
      setTimeUnit(value.toString())
    }
  }

  return (
    <span className="post-replies-container">
      <Checkbox checked={isChecked} onChange={ActivatePostReplies} isHeader={false} /> every{' '}
      <DropdownMenu
        name="time-gap"
        options={frequency.timeUnit === 'hours' ? timeGapHour : timeGapMinute}
        value={timeGap}
        onChange={(e) => HandleFrequencySelection('timeGap', e.toString().valueOf())}
        onReset={() => HandleFrequencySelection('timeGap', '-')}
        disable={!isChecked}
      />{' '}
      <DropdownMenu
        name="time-unit"
        options={timeUnits}
        value={timeUnit}
        onChange={(e) => HandleFrequencySelection('timeUnit', e.toString().valueOf())}
        onReset={() => HandleFrequencySelection('timeUnit', '-')}
        disable={!isChecked}
      />
    </span>
  )
}

const SocialSchedule = ({ rowData, onClose, onNotify }: SocialScheduleProps) => {
  const pid = rowData?.id || 'default-id'
  const [tweets, setTweets] = useState<string[]>([])

  const validate = ajv.compile(socialMediaCampaign)
  const valid = validate({ tweets: tweets })
  if (!valid) {
    console.info('[SocialMediaCampaign] Validation errors:', validate.errors)
  } else {
    console.info('[SocialMediaCampaign] Valid!')
  }

  const getTweetFileContent = async (pid: string) => {
    const res = await getTweetContent(pid)
    const clean = cleanThreadContent(res?.content)
    setTweets(clean)
  }

  const onTweetChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setTweets([e.target.value])

  useEffect(() => {
    getTweetFileContent(pid)
  }, [])

  return (
    <div className="social-schedule-container">
      {' '}
      <FieldRow label="Bluesky" value="@jdighist.bsky.social" />
      <FieldRow
        label="Tweet link"
        value={<LinkButton url={`http://github.com/jdh-observer/${pid}/blob/main/tweets.md`} />}
      />
      <FieldRow label="Time" value={<Schedule />} />
      <FieldRow label="Post replies" value={<PostReplies />} />
      <FieldRow
        label="Tweets"
        value={
          <div className="tweets-container">
            {tweets.map((tweet: string, index: number) => (
              <Textarea
                maxRows={5}
                defaultValue={tweet}
                key={index}
                error={getErrorByFieldAndByIndex(validate.errors || [], 'tweets', index)}
                endDecorator={
                  <Typography level="body-xs" sx={{ ml: 'auto', color: 'text.secondary' }}>
                    {tweet.length} / {socialMediaCampaign.properties['tweets'].items.maxLength}
                  </Typography>
                }
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  '& textarea::-webkit-scrollbar': {
                    display: 'none',
                  },
                  '& textarea': {
                    direction: 'rtl',
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                  },
                }}
              />
            ))}
          </div>
        }
      />
    </div>
  )
}

export default SocialSchedule
