import '../styles/pages/detail.css'
import '../styles/pages/pages.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import DatasetButton from '../components/Buttons/DatasetButton/DatasetButton'
import IconButton from '../components/Buttons/IconButton/IconButton'
import LinkButton from '../components/Buttons/LinkButton/LinkButton'
import AuthorCard from '../components/Card/AuthorCard/AuthorCard'
import Loading from '../components/Loading/Loading'
import Modal from '../components/Modal/Modal'
import SmallCard from '../components/SmallCard/SmallCard'
import { useActionStore, useItemStore } from '../store'
import { isTypeAbstract, isTypeArticle } from '../utils/helpers/checkItem'
import { setDetails } from '../utils/helpers/details'
import { FieldRow } from '../utils/helpers/field'
import { formatAbstract } from '../utils/helpers/sanitize'
import { DetailPage } from '../utils/types'

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
                {authors.map((author) => (
                  <AuthorCard author={author} />
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
