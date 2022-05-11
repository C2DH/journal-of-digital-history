import React from 'react'
import groupBy from 'lodash/groupBy'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import homePageContents from '../data/mock-api/mock-home-ipynb.json'
import {getArticleTreeFromIpynb} from '../logic/ipynb'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import HomeReel from '../components/HomeReel'
import HomeMilestones from '../components/HomeMilestones'
import {
  IsPortrait, BootstrapColumLayout,
  BootstrapFullColumLayout,
  IsMobile
} from '../constants'


const articleTree = getArticleTreeFromIpynb(homePageContents)
const {
  'journal': journalCells,
  'editorial-board': editorialBoardCells,
  'editorial-team': editorialTeamCells,
  'call-for-papers': callForPapers,
} = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section)


const Home = () => {
  const { t } = useTranslation()

  return (
    <>
    <Container className="page">

      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Write (Digital) History.</h1>
          <h2 className="my-5 mb-3-sm">
            As an international, academic, peer-reviewed and open-access journal,
            the Journal of Digital History (JDH) will set new standards in history publishing
            based on the principle of multi-layered articles.
          </h2>
          <HomeReel
            height={IsMobile ? 250 : 180}
          />
          <h2 className="mt-5" style={{
            fontFamily: 'var(--font-family-sans-serif)',
            lineHeight: '1.75',
            marginBottom: '2rem',
            fontSize: 'inherit',
            fontWeight: 'normal',
          }}>
            Our journal aims to become the central
            hub of critical debate and discussion in
            the field of Digital History by offering an innovative
            publication platform, promoting a new form of data-driven scholarship
            and of <span style={{background:'var(--primary)'}}>transmedia storytelling</span>&nbsp;
            in the historical sciences. <LangLink to="/about">Read More</LangLink>
          </h2>


        </Col>
      </Row>
      <Row>
        <Col md={{span:4, offset:2}}>
        {journalCells.map((props, i) => (
          <ArticleCellContent key={i} hideNum hideIdx={false} {...props} idx={i+1}/>
        ))}
        </Col>
        <Col md={{span:4, offset:0}}>
        <div className="border border-dark p-4" style={{
          position: 'sticky',
          top: '120px'
        }}>
        <h2 className="mb-4">{t('pages.home.callForPaper')}</h2>
        {callForPapers.map((props, i) => (
          <ArticleCellContent key={i} {...props} idx={i+1} hideIdx hideNum style={{lineHeight: 1.75}}/>
        ))}
        <LangLink to='/submit' className="btn btn-block btn-primary btn-lg">{t('pages.home.submitAbstract')}</LangLink>
        </div>
        </Col>
      </Row>
      <Row>
        <Col md={{offset:2}}>
          <h2 className="my-5">{t('pages.home.editorialBoardMembers')}</h2>
        </Col>
      </Row>
      <Row>
        {editorialTeamCells.map((props, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
          <ArticleCellContent hideNum hideIdx={false} {...props} idx="▲"/>
          </Col>
        ))}
      </Row>
      <Row className="mt-5">
        {/* }<Col md={{ offset: 2, span:10 }}>
          <h4 className="mt-5 mb-3 font-italic">{t('pages.home.editorialBoardMembersAlphabeticList')}</h4>
        </Col>*/}
        {editorialBoardCells.map((props, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
          <ArticleCellContent hideNum hideIdx={false} {...props} idx="▲"/>
          </Col>
        ))}
      </Row>
    </Container>

    <Container>
      <Row>
        <Col {...BootstrapFullColumLayout}>
          <h2 className="my-5">{t('pages.home.journalRoadmap')}</h2>
          <p className="mb-3 d-none d-md-block" >{t('pages.home.editorialRoadmap')} ⤵</p>
          <HomeMilestones
            isPortrait={IsPortrait}
            extent={['2020-09-30', '2022-11-30']}
          />
          <p className="mt-3 d-none d-md-block">{t('pages.home.technicalRoadmap')} ⤴</p>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default Home
