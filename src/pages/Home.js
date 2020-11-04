import React, { useEffect, useState } from 'react'
import LangLink from '../components/LangLink'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { Scrollama, Step } from 'react-scrollama';
import issues from '../data/mock-list-of-issues'
import { useStore } from '../store'

const STEPS = [
  {
    title: 'Write (Digital) History.',
    subheading: 'Want to share your vision of <b>digital history</b> with the academic world? Create mindblowing data-driven articles with Jupyter Notebook to fully integrate every possible data in the universe.',
    backgroundColor: 'var(--white)',
    paragraphs: [
      {
        highlight: 'Are you an author?',
        text: 'Tired of journals asking you to cut down your methodological developments? JDH introduces an hermeneutics layer where you will be fully able to go in the details.'
      }, {
        highlight: 'Show your data',
        text: 'Gathering data and preparing/structuring your corpus is 90% of the job. Show it, thanks to JDH’s <b>data</b> layer.',
      }, {
        highlight: '...and tell the (hi)story',
        text: 'JDH will allow you to elaborate a narrative  layer that goes beyond the traditional scope of academic journals.'
      }
    ]
  },
  {
    title: '3 layers.',
    subheading: 'Transmedia storytelling, critical reflection on the use of digital tools, and sharing the research data behind the argumentation. Make your story come alive!',
    backgroundColor: 'var(--white)',
    paragraphs: []
  },
  {
    title: 'Call for papers!',
    subheading: 'Transmedia storytelling, critical reflection on the use of digital tools, and sharing the research data behind the argumentation. Make your story come alive!',
    backgroundColor: 'var(--white)',
    paragraphs: []
  }
]

export default function Home(){
  const { t } = useTranslation()
  console.info(issues)
  useEffect(() => {

    // Update the document title using the browser API
    useStore.setState({ backgroundColor: STEPS[currentStepIndex ?? 0].backgroundColor });
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const onStepEnter = ({ data, direction }) => {
    console.info(direction, data)
    setCurrentStepIndex(data);
    useStore.setState({ backgroundColor: STEPS[data].backgroundColor });
  };
  const onStepProgress = (p) => {
    console.info(p)
  }
  const stepSize = 100
  const stepTitleSlide = -(currentStepIndex || 0) * stepSize
  return (
    <div className="page">
      <Container>
      <Row>
        <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
        <h1 className="display-3 m-0">Make <i>History</i><br/> Awesome Again</h1>
        <h2><LangLink to='/submit' style={{color: 'var(--secondary)', textDecoration: 'underline'}}>submit a paper &rarr;</LangLink></h2>
        </Col>
      </Row>
      </Container>
      <div>
        <div style={{ position: 'sticky', top: '50vh', marginTop:'-50px', zIndex: 1}}>
          <div className="position-absolute animate-transform w-100" style={{
            transform: `translate(0, ${stepTitleSlide}px`}}>
            <Container>
            <Row>
              <Col md={{span:4, offset:0}} lg={{span:3, offset:0}}>
            {STEPS.map(({ title, backgroundColor}, stepIndex) => (
              <div key={stepIndex} className="position-absolute" style={{
                height: `${stepSize}px`,
                opacity: stepIndex === currentStepIndex ? 1 : .5,
                top: `${stepSize*stepIndex}px`,
              }}>
                <h2 className="p-2">{t(title)}</h2>
              </div>
            ))}
              </Col></Row>
              </Container>
          </div>
        </div>
        <Scrollama className="pt-5" onStepEnter={onStepEnter} onStepProgress={onStepProgress} threshold={0} offset={0.5}>
        {STEPS.map((step, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>
            <div
              style={{
                minHeight: '60vh',
                paddingTop: '10vh',
                paddingBottom: '10vh',
                opacity: currentStepIndex === stepIndex ? 1 : 0.2,
              }}
            >
              <Container>
                <Row>
                  <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
                    <h3 dangerouslySetInnerHTML={{ __html: step.subheading }} />
                  </Col>
                </Row>
                {step.paragraphs.map(paragraph => (
                  <Row>
                    <Col md={{span:8, offset:4}} lg={{span:6, offset:3}}>
                      <p className="serif lead my-3" dangerouslySetInnerHTML={{ __html: paragraph.text }}/>
                    </Col>
                  </Row>
                ))}
              </Container>
            </div>
          </Step>
        ))}
      </Scrollama>
      </div>
    </div>
  );
};
// <ScrollableGallery
//   id='latestIssues'
//   offsetTop='70px'
//   title={t('pages.home.latestIssues')}
//   steps={issues?.results}
//   stepComponent=''/>
