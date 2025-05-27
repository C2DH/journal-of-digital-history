import { useEffect, useState } from 'react'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { Issue } from '../interfaces/issue'

import '../styles/pages/pages.css'

const Datasets = () => {
  const [datasets, setDatasets] = useState<Issue[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datasetsList = await fetchItems('/api/datasets', USERNAME, PASSWORD)
        setDatasets(datasetsList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="datasets page">
      <Card item="datasets" headers={['id', 'url', 'description']} data={datasets} />
    </div>
  )
}

export default Datasets
