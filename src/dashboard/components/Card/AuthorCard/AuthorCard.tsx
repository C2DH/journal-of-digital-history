import './AuthorCard.css'

import IconButton from '../../../components/Buttons/IconButton/IconButton'
import SmallCard from '../../../components/SmallCard/SmallCard'
import { FieldRow } from '../../../utils/helpers/field'

const AuthorCard = ({ author }) => {
  return (
    <div className="card-authors">
      <SmallCard key={author.id} className={`card-author`}>
        <h2>
          {author.firstname} {author.lastname}
        </h2>
        <div className="author-info">
          <FieldRow label="Email" value={`${author.email}`} />
          <FieldRow label="Affiliation" value={`${author.affiliation}`} />
          <FieldRow
            label="Links"
            value={
              <>
                {author.orcid && <IconButton className="orcid-icon" value={author.orcid} />}
                {author.github_id && author.github_id !== 'default_github_id' && (
                  <IconButton value={`https://github.com/${author.github_id}`} />
                )}
                {author.bluesky_id && (
                  <IconButton value={`https://bsky.app/profile/${author.bluesky_id}.bsky.social`} />
                )}
                {author.facebook_id && (
                  <IconButton value={`https://www.facebook.com/${author.facebook_id}`} />
                )}
                {author.linkedin_id && (
                  <IconButton value={`https://linkedin.com/in/${author.linkedin_id}`} />
                )}
              </>
            }
          />
        </div>
      </SmallCard>
    </div>
  )
}

export default AuthorCard
