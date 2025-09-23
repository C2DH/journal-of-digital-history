import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import CustomPieChart from '../components/CustomPieChart/CustomPieChart'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className="home-grid">
        <CustomPieChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home
