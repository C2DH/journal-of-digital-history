import '../styles/pages/detail.css'
import '../styles/pages/pages.css'

import parse from 'html-react-parser'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

import CustomTooltip from '../../components/Tooltip'
import IconButton from '../components/Buttons/IconButton/IconButton'
import LinkButton from '../components/Buttons/LinkButton/LinkButton'
import Loading from '../components/Loading/Loading'
import SmallCard from '../components/SmallCard/SmallCard'
import Status from '../components/Status/Status'
import { useItemStore } from '../store'
import { setDetails } from '../utils/helpers/setDetails'

function formatAbstract(abstract?: string): string {
  if (!abstract) return ''
  return String(abstract)
    .replace(/\r?\n/g, '<br />')
    .replace(/(?:^|<br\s*\/?>)\s*([\wÀ-ÿ'’\-., ]{1,40})\s*(?=<br\s*\/?>|$)/g, (match, p1) => {
      const wordCount = p1.trim().split(/\s+/).length
      return wordCount <= 4 ? match.replace(p1, `<b>${p1}</b>`) : match
    })
    .replace(/<br\s*<b>/g, '<br /><b>')
}

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="item">
    <span className="label">{label}</span>
    {label === 'Email' ? (
      <a className="value" href={`mailto:${value}`}>
        {value}
      </a>
    ) : label === 'Status' ? (
      <Status value={String(value)} />
    ) : (
      <span className="value">{value}</span>
    )}
  </div>
)

const Detail = ({ endpoint }) => {
  const location = useLocation()
  const id = location.pathname.split('/')[2]
  const { data: item, loading, error, fetchItem, reset } = useItemStore()

  useEffect(() => {
    reset()
    fetchItem(id, endpoint)
  }, [fetchItem, id, endpoint, reset])

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

  const { infoFields, contactFields, datasetFields, urlFields, title, abstractText } =
    setDetails(item)

  return (
    <div className="detail page ">
      <div className="empty-space"></div>
      <div className="detail-grid">
        <SmallCard className="card-info">
          {infoFields.map(({ label, value }) => (
            <FieldRow key={label} label={label} value={value} />
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
              {datasetFields.map(({ label, value, description }, index) =>
                value ? (
                  <div key={index} className="dataset">
                    <LinkButton key={index} url={String(value)} />
                    <CustomTooltip
                      fieldname="description"
                      index={0}
                      text={description}
                      icon="info"
                    />
                  </div>
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
          {contactFields.map(({ label, value }) => (
            <FieldRow key={label} label={label} value={value} />
          ))}
        </SmallCard>
      </div>
    </div>
  )
}

export default Detail
