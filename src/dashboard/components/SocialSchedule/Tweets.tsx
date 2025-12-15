import { Textarea, Typography } from '@mui/joy'

import { getErrorByField, getErrorByFieldAndByIndex } from '../../../logic/errors'
import { socialMediaCampaign } from '../../schemas/socialMediaCampaign'
import Loading from '../Loading/Loading'

const Tweets = ({ action, tweets, errors }) => {
  const commonStyles = {
    sx: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '12.5px',
      '& textarea::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }

  if (tweets.length === 0) {
    return (
      <div className="tweets-loading">
        <Loading />
      </div>
    )
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
          defaultValue={tweets[0]}
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
              {tweets[0].length}
            </Typography>
          }
        />
      )}
    </div>
  )
}

export default Tweets
