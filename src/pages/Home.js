import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from 'react-bootstrap'
import ScrollableGallery from '../components/ScrollableGallery'
import issues from '../data/mock-list-of-issues'
import { useStore } from '../store'

export default function Home(){
  const { t } = useTranslation()
  console.info(issues)
  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--white)' });
  });
  return (
    <div className="page">
      <Container>
        <h1>Explore our issues</h1>
        <h2>{t('start')}</h2>
      </Container>
      <ScrollableGallery
        id='latestIssues'
        offsetTop='70px'
        title={t('pages.home.latestIssues')}
        steps={issues?.results}
        stepComponent=''/>
    </div>
  );
}
