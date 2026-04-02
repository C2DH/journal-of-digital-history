import '../styles/pages/detail.css'
import '../styles/pages/pages.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import DatasetButton from '../components/Buttons/DatasetButton/DatasetButton'
import IconButton from '../components/Buttons/IconButton/IconButton'
import LinkButton from '../components/Buttons/LinkButton/LinkButton'
import StatusButton from '../components/Buttons/StatusButton/StatusButton'
import Loading from '../components/Loading/Loading'
import Modal from '../components/Modal/Modal'
import SmallCard from '../components/SmallCard/SmallCard'
import { useActionStore, useItemStore } from '../store'
import { isTypeAbstract, isTypeArticle } from '../utils/helpers/checkItem'
import { setDetails } from '../utils/helpers/details'
import { formatAbstract } from '../utils/helpers/sanitize'
import { DefaultAction, DetailPage, FieldRowType } from '../utils/types'

const FieldRow = ({ label, value, pid, isArticle, isAbstract }: FieldRowType) => {
  const { getDetailActions } = useActionStore()
  if (label === 'Email') {
    value = (
      <a className="value" href={`mailto:${value}`}>
        {value}
      </a>
    )
  } else if (label === 'Status' && isArticle !== undefined && isAbstract !== undefined) {
    let actions: any = []
    actions = getDetailActions(pid, isArticle, isAbstract)

    //Remove current status from list of status actions
    const index = actions
      .map((actions: DefaultAction) => actions.action.toUpperCase())
      .indexOf(String(value))
    actions.splice(index, 1)

    value = <StatusButton actions={actions} value={String(value)} />
  } else {
    value = <span className="value">{value}</span>
  }

  return (
    <div className="item">
      <span className="label">{label}</span>
      {value}
    </div>
  )
}

const Detail = ({ endpoint }: DetailPage) => {
  const location = useLocation()
  const id = location.pathname.split('/')[2]
  const { data: item, loading, error, fetchItem, reset } = useItemStore()
  const { modal, closeModal } = useActionStore()

  useEffect(() => {
    reset()
    fetchItem(id, endpoint)
  }, [fetchItem, id, endpoint, reset])

  const isArticle = isTypeArticle(item)
  const isAbstract = isTypeAbstract(item)

  const { infoFields, contactFields, datasetFields, authors, urlFields, title, abstractText } =
    setDetails(item)

  if (loading) {
    return <Loading />
  }

  if (!item) {
    return (
      <div className="detail page">
        <div className="detail-grid">
          <p>Error: Item not found. {error} </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {' '}
      <div className="detail page ">
        <div className="detail-grid">
          <SmallCard className="card-info">
            {infoFields.map(({ label, value }) => (
              <FieldRow
                key={label}
                label={label}
                value={value}
                pid={id}
                isArticle={isArticle}
                isAbstract={isAbstract}
              />
            ))}
          </SmallCard>
          <SmallCard className="card-link">
            <h2>Links</h2>
            {urlFields ? (
              urlFields.map(({ value }, index) =>
                value ? <LinkButton key={index} url={String(value)} /> : null,
              )
            ) : (
              <span>-</span>
            )}
            {datasetFields.length > 0 ? (
              <>
                <h4>Datasets</h4>
                {datasetFields.map(({ label, value: url, description }, index) =>
                  url ? (
                    <DatasetButton
                      key={index}
                      url={String(url)}
                      description={String(description)}
                    />
                  ) : (
                    <span>-</span>
                  ),
                )}
              </>
            ) : null}
          </SmallCard>
          <SmallCard className="card-abstract">
            <h2>{title}</h2>
            <div>{abstractText ? parse(formatAbstract(String(abstractText))) : null}</div>
          </SmallCard>
          <SmallCard className="card-contact">
            <div className="contact-header">
              {' '}
              <h2>Contact</h2>
              {item.contact_orcid || item.abstract.contact_orcid ? (
                <IconButton
                  className="orcid-icon"
                  value={item.contact_orcid || item.abstract.contact_orcid}
                />
              ) : (
                ''
              )}
            </div>
            <div className="contact-info">
              {contactFields.map(({ label, value }) => (
                <FieldRow key={label} label={label} value={value} />
              ))}
            </div>
          </SmallCard>
          <div className="card-authors">
            {authors.length > 0 ? (
              <>
                {authors.map((author, index) => (
                  <SmallCard key={index} className={`card-author`}>
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
                            {author.orcid && (
                              <IconButton className="orcid-icon" value={author.orcid} />
                            )}
                            {author.github_id && author.github_id !== 'default_github_id' && (
                              <IconButton value={`https://github.com/${author.github_id}`} />
                            )}
                            {author.bluesky_id && (
                              <IconButton
                                value={`https://bsky.app/profile/${author.bluesky_id}.bsky.social`}
                              />
                            )}
                            {author.facebook_id && (
                              <IconButton
                                value={`https://www.facebook.com/${author.facebook_id}`}
                              />
                            )}
                            {author.linkedin_id && (
                              <IconButton value={`https://linkedin.com/in/${author.linkedin_id}`} />
                            )}
                          </>
                        }
                      />
                    </div>
                  </SmallCard>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        item={item}
        open={modal.open}
        onClose={closeModal}
        action={modal.action}
        data={modal}
      />
    </>
  )
}

export default Detail
