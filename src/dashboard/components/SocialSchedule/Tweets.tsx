import { Textarea, Typography } from '@mui/joy'

import { getErrorByField, getErrorByFieldAndByIndex } from '../../../logic/errors'
import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'

const Tweets = ({ action, tweets, errors }) => {
  const totalLength = Array.isArray(tweets)
    ? tweets.reduce((acc, tweet) => acc + tweet.length, 0)
    : tweets.length

  const commonStyles = {
    sx: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '12.5px',
      '& textarea::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }

  return (
    <div className="tweets-container">
      {action === 'Bluesky' &&
        tweets.map((tweet: string, index: number) => {
          const error = getErrorByFieldAndByIndex(errors || [], 'tweets', index)
          return (
            <Textarea
              maxRows={5}
              defaultValue={tweet}
              key={index}
              error={error}
              sx={{
                ...commonStyles.sx,
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
      {action === 'Facebook' && (
        <Textarea
          maxRows={5}
          defaultValue={tweets}
          key={'facebook-content'}
          error={Boolean(getErrorByField(errors || [], 'tweets'))}
          sx={{
            ...commonStyles.sx,
            '& textarea': {
              color: getErrorByField(errors || [], 'tweets')
                ? 'var(--color-error)'
                : 'var(--color-deep-blue)',
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none',
            },
          }}
          endDecorator={
            <Typography
              level="body-xs"
              sx={{
                ml: 'auto',
                color: getErrorByField(errors || [], 'tweets')
                  ? 'var(--color-error)'
                  : 'var(--color-deep-blue)',
              }}
            >
              {totalLength}
            </Typography>
          }
        />
      )}
    </div>
  )
}

export default Tweets
