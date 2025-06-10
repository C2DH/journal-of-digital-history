import '../styles/pages/detail.css'
import '../styles/pages/pages.css'

import parse from 'html-react-parser'
import { useLocation } from 'react-router'

import GithubLink from '../components/GithubLink/GithubLink'
import Loading from '../components/Loading/Loading'
import { SmallCard } from '../components/SmallCard/SmallCard'
import { useFetchItem } from '../hooks/useFetch'
import { convertDate } from '../utils/convertDate'
import { convertStatus } from '../utils/convertStatus'
import { Abstract, Article } from '../utils/types'

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="item">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

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

function isAbstract(item: any): item is Abstract {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.pid === 'string' &&
    typeof item.title === 'string'
  )
}

function isArticle(item: any): item is Article {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.abstract.pid === 'string' &&
    typeof item.abstract.title === 'string'
  )
}

const Detail = ({ endpoint }) => {
  const location = useLocation()
  const id = location.pathname.split('/')[2]

  const { data: item, error, loading } = useFetchItem(`${endpoint}${id}`)

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

  // Type guard usage
  let infoFields: { label: string; value: React.ReactNode }[] = []
  let contactFields: { label: string; value: React.ReactNode }[] = []
  let url = ''
  let title = ''
  let abstractText = ''

  if (isAbstract(item)) {
    infoFields = [
      { label: 'PID', value: item.pid },
      {
        label: 'Call for papers',
        value: item.callpaper === null ? 'Open Submission' : item.callpaper,
      },
      { label: 'Status', value: convertStatus(String(item.status)) },
      { label: 'Terms accepted', value: item.consented ? 'Yes' : 'No' },
      { label: 'Submission date', value: convertDate(item.submitted_date) },
      { label: 'Validation date', value: convertDate(item.validation_date) },
    ]
    contactFields = [
      { label: 'Contact name', value: `${item.contact_firstname} ${item.contact_lastname}` },
      { label: 'Affiliation', value: `${item.contact_affiliation}` },
      { label: 'Email', value: item.contact_email === undefined ? '-' : item.contact_email },
    ]
    url = `https://github.com/jdh-observer/${item?.pid}`
    title = item.title
    abstractText = item.abstract
  } else if (isArticle(item)) {
    infoFields = [
      { label: 'PID', value: item.abstract.pid },
      { label: 'Call for papers', value: item.issue.name || 'Open Submission' },
      { label: 'Status', value: convertStatus(String(item.status)) },
      { label: 'Terms accepted', value: item.abstract.consented ? 'Yes' : 'No' },
      { label: 'Submission date', value: convertDate(item.abstract.submitted_date) },
      { label: 'Validation date', value: convertDate(item.abstract.validation_date) },
    ]
    contactFields = [
      {
        label: 'Contact name',
        value: `${item.abstract.contact_firstname} ${item.abstract.contact_lastname}`,
      },
      { label: 'Affiliation', value: `${item.abstract.contact_affiliation}` },
      {
        label: 'Email',
        value: item.abstract.contact_email === undefined ? '-' : item.abstract.contact_email,
      },
    ]
    url = item.repository_url
    title = item.data?.title[0] || ''
    abstractText = item.data?.abstract[0] || ''
  }

  return (
    <div className="detail page ">
      <div className="detail-grid">
        <SmallCard className="card-info">
          {infoFields.map(({ label, value }) => (
            <FieldRow key={label} label={label} value={value} />
          ))}
        </SmallCard>
        <SmallCard className="card-repository">
          <h2>Repository</h2>
          <GithubLink url={url} />
        </SmallCard>
        <SmallCard className="card-abstract">
          <h2>{title}</h2>
          <div>{abstractText ? parse(formatAbstract(String(abstractText))) : null}</div>
        </SmallCard>
        <SmallCard className="card-contact">
          <h2>Contact</h2>
          {contactFields.map(({ label, value }) => (
            <FieldRow key={label} label={label} value={value} />
          ))}
        </SmallCard>
      </div>
    </div>
  )
}

export default Detail
