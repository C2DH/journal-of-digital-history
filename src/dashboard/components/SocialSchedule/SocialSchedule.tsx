import './SocialSchedule.css'

import { Textarea, Typography } from '@mui/joy'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Frequency, SocialMediaCampaign, SocialScheduleProps } from './interface'

import { getErrorByFieldAndByIndex } from '../../../logic/errors'
import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'
import { useFormStore } from '../../store'
import { getSocialMediaCover, getTweetContent, postBlueskyCampaign } from '../../utils/api/api'
import { validateForm } from '../../utils/helpers/checkSchema'
import Button from '../Buttons/Button/Button'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Schedule from './DatePicker/DatePicker'
import PostReplies from './PostReplies'

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

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fieldrow">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

const SocialSchedule = ({ rowData, onClose, onNotify }: SocialScheduleProps) => {
  const { t } = useTranslation()
  const pid = rowData?.id || 'default-id'
  const repositoryUrl = rowData?.row[6] || ''
  const [tweets, setTweets] = useState<string[]>([])
  const [cover, setCover] = useState<string>('')
  const [frequency, setFrequency] = useState<Frequency>({ timeGap: '-', timeUnit: '-' })
  const [form, setForm] = useState<SocialMediaCampaign>({
    repository_url: repositoryUrl,
    article_url: `https://journalofdigitalhistory.org/en/article/${pid}`,
    schedule_main: [''],
  })
  const { isModalOpen, formData, openModal, closeModal, setFormData } = useFormStore()

  // Validation for tweets, covers and form from Github
  const { valid, errors } = validateForm(
    { tweets: tweets, cover_url: cover, ...form },
    socialMediaCampaign,
  )

  if (!valid) {
    console.info('[SocialMediaCampaign] Validation errors:', errors)
  } else {
    console.info('[SocialMediaCampaign] Valid!')
  }

  const getTweetFileContent = async (pid: string) => {
    const res = await getTweetContent(pid)
    const clean = cleanThreadContent(res?.content)
    setTweets(clean)
  }

  const getSocialMediaImage = async (pid: string) => {
    const res = await getSocialMediaCover(pid)
    setCover(res.download_url)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valid) {
      try {
        const res = await postBlueskyCampaign(form)
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'success',
            message: t('socialCampaign.api.success'),
            submessage: res?.data?.message || '',
          })
      } catch (err: any) {
        if (onClose) onClose()
        if (onNotify)
          onNotify({
            type: 'error',
            message: t('socialCampaign.api.error'),
            submessage: err?.response?.data?.message,
          })
      } finally {
        closeModal()
      }
    }
    if (!valid) {
      onNotify({
        type: 'error',
        message: t('socialCampaign.validation.error.message'),
        submessage: t('socialCampaign.validation.error.submessage'),
      })
      console.error(errors)
      return
    }
  }

  const handleChange = (value: string[]) => {
    setForm({
      ...(form || {}),
      schedule_main: value,
    })
  }

  useEffect(() => {
    getTweetFileContent(pid)
    getSocialMediaImage(pid)
  }, [])

  return (
    <form className="bluesky-campaign-form" onSubmit={handleFormSubmit}>
      <div className="social-schedule-container">
        {' '}
        <FieldRow label="Bluesky" value="@jdighist.bsky.social" />
        <FieldRow
          label="Tweet link"
          value={<LinkButton url={`http://github.com/jdh-observer/${pid}/blob/main/tweets.md`} />}
        />
        <FieldRow
          label="Time"
          value={
            <Schedule frequency={frequency} numberTweets={tweets.length} onChange={handleChange} />
          }
        />
        <FieldRow
          label="Post replies"
          value={<PostReplies frequency={frequency} onChange={setFrequency} />}
        />
        <FieldRow
          label="Tweets"
          value={
            <div className="tweets-container">
              {tweets.map((tweet: string, index: number) => {
                const error = getErrorByFieldAndByIndex(errors || [], 'tweets', index)
                return (
                  <Textarea
                    maxRows={5}
                    defaultValue={tweet}
                    key={index}
                    error={error}
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12.5px',
                      '& textarea::-webkit-scrollbar': {
                        display: 'none',
                      },
                      '& textarea': {
                        color: error ? 'var(--color-error)' : 'var(--color-deep-blue)',
                        '-ms-overflow-style': 'none',
                        'scrollbar-width': 'none',
                      },
                    }}
                    endDecorator={
                      <Typography
                        level="body-xs"
                        sx={{
                          ml: 'auto',
                          color: error ? 'var(--color-error)' : 'var(--color-deep-blue)',
                        }}
                      >
                        {tweet.length} / {socialMediaCampaign.properties['tweets'].items.maxLength}
                      </Typography>
                    }
                  />
                )
              })}
            </div>
          }
        />
        {cover ? (
          <div className="social-media-cover-container">
            {' '}
            <img src={cover} alt="Social Media Cover" className="social-media-cover-image"></img>
          </div>
        ) : (
          'No social cover image found.'
        )}
        <Button type="submit" text={t('socialCampaign.send', 'Send')} />{' '}
      </div>
    </form>
  )
}

export default SocialSchedule
