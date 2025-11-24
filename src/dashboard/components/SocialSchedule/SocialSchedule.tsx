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

import { SocialScheduleProps } from './interface'

import { getErrorByFieldAndByIndex } from '../../../logic/errors'
import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'
import { theme as currentTheme } from '../../styles/theme'
import { getTweetContent } from '../../utils/api/api'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Checkbox from '../Checkbox/Checkbox'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getDensePickerTheme } from './calendarTheme'

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

const SocialSchedule = ({ rowData, onClose, onNotify }: SocialScheduleProps) => {
  const pid = rowData?.id || 'default-id'
  const [tweets, setTweets] = useState<string[]>([])

  const validate = ajv.compile(socialMediaCampaign)
  const valid = validate({ tweets: tweets })
  if (!valid) {
    console.log('Validation errors:', validate.errors)
  } else {
    console.log('Valid!')
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
