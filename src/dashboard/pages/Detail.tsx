import '../styles/pages/detail.css'
import '../styles/pages/pages.css'

import parse from 'html-react-parser'
import { useLocation } from 'react-router'

import GithubLink from '../components/GithubLink/GithubLink'
import Loading from '../components/Loading/Loading'
import { SmallCard } from '../components/SmallCard/SmallCard'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItem } from '../hooks/fetchData'
import { Abstract } from '../interfaces/abstract'
import { convertDate } from '../logic/convertDate'

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

const Detail = () => {
  const location = useLocation()
  const id = location.pathname.split('/')[2]

  const {
    data: item,
    error,
    loading,
  } = useFetchItem<Abstract>(`/api/abstracts/${id}`, USERNAME, PASSWORD)

  if (loading) {
    return <Loading />
  }

  return (
    <div className="detail page ">
      <div className="detail-grid">
        <SmallCard className="card-info">
          <FieldRow label="PID" value={item?.pid} />
          <FieldRow
            label="Call for papers"
            value={item?.callpaper === null ? 'Open Submission' : item?.callpaper}
          />
          <FieldRow label="Status" value={item?.status} />
          <FieldRow label="Terms accepted" value={item?.consented ? 'Yes' : 'No'} />
          <FieldRow label="Submission date" value={convertDate(item?.submitted_date)} />
          <FieldRow label="Validation date" value={convertDate(item?.validation_date)} />
        </SmallCard>
        <SmallCard className="card-repository">
          <h2>Repository</h2>
          <GithubLink url={`https://github.com/jdh-observer/${item?.pid}`} />
        </SmallCard>

        <SmallCard className="card-abstract">
          <h2>{item?.title}</h2>
          <div>{item?.abstract ? parse(formatAbstract(item.abstract)) : null}</div>
        </SmallCard>

        <SmallCard className="card-contact">
          <h2>Contact</h2>
          <FieldRow
            label="Contact name"
            value={`${item?.contact_firstname} ${item?.contact_lastname}`}
          />
          <FieldRow label="Affiliation" value={`${item?.contact_affiliation}`} />
          <FieldRow
            label="Email"
            value={`${item?.contact_email === undefined ? '-' : item?.contact_email}`}
          />
        </SmallCard>
      </div>
    </div>
  )
}

export default Detail
