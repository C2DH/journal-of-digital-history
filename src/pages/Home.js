import React from 'react'
import groupBy from 'lodash/groupBy'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, } from 'react-bootstrap'
import LangLink from '../components/LangLink'
import homePageContents from '../data/mock-api/mock-home-ipynb.json'
import {getArticleTreeFromIpynb} from '../logic/ipynb'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import MilestoneTimeline from '../components/MilestoneTimeline'
import IssueReel from '../components/Issue/IssueReel'
import { IsPortrait, BootstrapColumLayout } from '../constants'


const articleTree = getArticleTreeFromIpynb(homePageContents)
const {
  'journal': journalCells,
  'editorial-board': editorialBoardCells,
  'editorial-team': editorialTeamCells,
  'call-for-papers': callForPapers,
  'milestones': milestones
} = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section)


const Home = () => {
  const { t } = useTranslation()

  return (
    <>
    <Container className="page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <IssueReel />
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Write (Digital) History.</h1>
          <h2 className="my-5">
            As an international, academic, peer-reviewed and open-access journal,
            the Journal of Digital History (JDH) will set new standards in history publishing
            based on the principle of multi-layered articles.
          </h2>
          <h2 style={{
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
      <Row>
        <Col md={{offset:2, span:8}}>
          <h2 className="my-5">{t('pages.home.journalRoadmap')}</h2>
          <h4 className="mb-3 d-none d-md-block" >{t('pages.home.editorialRoadmap')} ⤵</h4>
          {milestones.map((milestone, i) => (
            <MilestoneTimeline key={i}
              isPortrait={IsPortrait}
              milestones={milestone.metadata?.jdh?.dataset}
              extent={milestone.metadata?.jdh?.extent?.date}
              showToday
            />
          ))}
          <h4 className="mt-3 d-none d-md-block">{t('pages.home.technicalRoadmap')} ⤴</h4>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default Home
//     <div className="page">
//       <Container>
//       <Row>
//         <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
//         <h1 className="display-3 m-0">Make <i>History</i><br/> Awesome Again</h1>
//         <h2><LangLink to='/submit' style={{color: 'var(--secondary)', textDecoration: 'underline'}}>submit a paper &rarr;</LangLink></h2>
//         </Col>
//       </Row>
//       </Container>
//       <div>
//         <div style={{ position: 'sticky', top: '50vh', marginTop:'-50px', zIndex: 1}}>
//           <div className="position-absolute animate-transform w-100" style={{
//             transform: `translate(0, ${stepTitleSlide}px`}}>
//             <Container>
//             <Row>
//               <Col md={{span:4, offset:0}} lg={{span:3, offset:0}}>
//             {STEPS.map(({ title, backgroundColor}, stepIndex) => (
//               <div key={stepIndex} className="position-absolute" style={{
//                 height: `${stepSize}px`,
//                 opacity: stepIndex === currentStepIndex ? 1 : .5,
//                 top: `${stepSize*stepIndex}px`,
//               }}>
//                 <h2 className="p-2">{t(title)}</h2>
//               </div>
//             ))}
//               </Col></Row>
//               </Container>
//           </div>
//         </div>
//         <Scrollama className="pt-5" onStepEnter={onStepEnter} onStepProgress={onStepProgress} threshold={0} offset={0.5}>
//         {STEPS.map((step, stepIndex) => (
//           <Step data={stepIndex} key={stepIndex}>
//             <div
//               style={{
//                 minHeight: '60vh',
//                 paddingTop: '10vh',
//                 paddingBottom: '10vh',
//                 opacity: currentStepIndex === stepIndex ? 1 : 0.2,
//               }}
//             >
//               <Container>
//                 <Row>
//                   <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
//                     <h3 dangerouslySetInnerHTML={{ __html: step.subheading }} />
//                   </Col>
//                 </Row>
//                 {step.paragraphs.map(paragraph => (
//                   <Row>
//                     <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
//                       <p className="serif lead my-3" dangerouslySetInnerHTML={{ __html: paragraph.text }}/>
//                     </Col>
//                   </Row>
//                 ))}
//               </Container>
//             </div>
//           </Step>
//         ))}
//       </Scrollama>
//       </div>
//     </div>
//   );
// };
// <ScrollableGallery
//   id='latestIssues'
//   offsetTop='70px'
//   title={t('pages.home.latestIssues')}
//   steps={issues?.results}
//   stepComponent=''/>
