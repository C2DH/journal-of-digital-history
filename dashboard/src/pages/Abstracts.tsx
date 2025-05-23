import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'

import '../styles/pages/pages.css'

type Abstract = {
  pid: string
  title: string
  submitted_date: string
  validation_date: string
  status: string
  contact_lastname: string
  contact_firstname: string
  contact_affiliation: string
}

const Abstracts = () => {
  console.log('here')
  const { t } = useTranslation()
  const [abstracts, setAbstracts] = useState<Abstract[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abstractsList = await fetchItems(
          '/api/abstracts',
          import.meta.env.VITE_API_USERNAME,
          import.meta.env.VITE_API_PASSWORD,
        )
        setAbstracts(abstractsList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="abstract page">
      <Card
        item="abstracts"
        headers={[
          'pid',
          'title',
          'submitted_date',
          'validation_date',
          'contact_lastname',
          'contact_firstname',
          'contact_affiliation',
          'status',
        ]}
        data={abstracts}
      />
    </div>
  )
}

export default Abstracts
