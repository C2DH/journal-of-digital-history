import './SocialSchedule.css'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Frequency, SocialMediaCampaign, SocialScheduleProps } from './interface'

import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'
import { useFormStore } from '../../store'
import {
  getSocialMediaCover,
  getTweetContent,
  postBlueskyCampaign,
  postFacebookCampaign,
} from '../../utils/api/api'
import { validateForm } from '../../utils/helpers/checkSchema'
import { cleanThreadContent } from '../../utils/helpers/cleanTweet'
import Button from '../Buttons/Button/Button'
import LinkButton from '../Buttons/LinkButton/LinkButton'
import Schedule from './DatePicker/DatePicker'
import PostReplies from './PostReplies'
import Tweets from './Tweets'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fieldrow">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

const SocialSchedule = ({ rowData, action, onClose, onNotify }: SocialScheduleProps) => {
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
  const { closeModal } = useFormStore()

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
        let res = {} as AxiosResponse<any, any>

        if (action === 'Bluesky') {
          res = await postBlueskyCampaign(form)
        }
        if (action === 'Facebook') {
          res = await postFacebookCampaign(form)
        }
        onClose()

        if (onNotify)
          onNotify({
            type: 'success',
            message: t('socialCampaign.api.success'),
            submessage: res?.data?.message || '',
          })
      } catch (err: any) {
        onClose()

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
    <form className="social-campaign-form" onSubmit={handleFormSubmit}>
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
        {action === 'Bluesky' && (
          <FieldRow
            label="Post replies"
            value={<PostReplies frequency={frequency} onChange={setFrequency} />}
          />
        )}
        <FieldRow
          label="Tweets"
          value={<Tweets action={action} tweets={tweets} errors={errors} />}
        />
        {
          <div className="social-media-cover-container">
            {' '}
            {cover ? (
              <img src={cover} alt="Social Media Cover" className="social-media-cover-image"></img>
            ) : (
              'No social cover image found.'
            )}
          </div>
        }
        <Button type="submit" text={t('socialCampaign.send', 'Send')} />{' '}
      </div>
    </form>
  )
}

export default SocialSchedule
