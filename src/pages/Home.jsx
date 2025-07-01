import MarkdownIt from 'markdown-it'
import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import HomeMilestones from '../components/HomeMilestones'
import HomeReel from '../components/HomeReel'
import LangLink from '../components/LangLink'
import {
  BootstrapColumLayout,
  BootstrapFullColumLayout,
  IsMobile,
  IsPortrait,
  StatusSuccess,
} from '../constants/globalConstants'
import { randomFakeSentence } from '../logic/random'
import '../styles/pages/Home.scss'
import StaticPageLoader from './StaticPageLoader'

const markdownParser = MarkdownIt({
  html: false,
  linkify: false,
  typographer: true,
})

const Home = ({ data = '', status }) => {
  const { t } = useTranslation()
  console.debug('[Home] loaded: ', status)

  // Comment out useMemo and use a regular assignment instead
  // const [intro, steps, editorialTeam, editorialBoard, callForPapers] = useMemo(() => { ... }, [status, data])

  let intro, steps, editorialTeam, editorialBoard, callForPapers
  if (status !== StatusSuccess) {
    // return preloaded, partial data
    ;[intro, steps, editorialTeam, editorialBoard, callForPapers] = [
      [
        'Write Digital History.',
        'As an international, academic, peer-reviewed and open-access journal, the Journal of Digital History (JDH) will set new standards in history publishing based on the principle of multi-layered articles.',
        randomFakeSentence(200),
      ],
      [
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
      ],
      [
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
      ],
      [
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
        randomFakeSentence(10) + '\n' + randomFakeSentence(200),
      ],
      [randomFakeSentence(10) + '\n' + randomFakeSentence(60)],
    ]
  } else {
    ;[intro, steps, editorialTeam, editorialBoard, callForPapers] = data.split('---').map((d) => {
      return d
        .trim()
        .split(/\n\n/)
        .map((source) => markdownParser.render(source))
    })
  }
  return (
    <>
      <Container className={`page Home ${status !== StatusSuccess ? 'is-fake' : ''}`}>
        <Row>
          <Col {...BootstrapColumLayout}>
            <h1 className="my-5">{intro[0].replace(/<[^>]+>/g, '')}</h1>
            <h2 className="my-5 mb-3-sm">{intro[1].replace(/<[^>]+>/g, '')}</h2>
            <HomeReel height={IsMobile ? 250 : 180} />
            <h2
              className="mt-5"
              style={{
                fontFamily: 'var(--font-family-sans-serif)',
                lineHeight: '1.75',
                marginBottom: '2rem',
                fontSize: 'inherit',
                fontWeight: 'normal',
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: intro[2].replace(
                    'transmedia storytelling',
                    '<span class="bg-primary">transmedia storytelling</span>',
                  ),
                }}
              />
              <LangLink to="/about">Read More</LangLink>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 2 }}>
            {steps.map((content, i) => (
              <ArticleCellContent key={i} content={content} hideNum hideIdx={false} idx={i + 1} />
            ))}
          </Col>
          <Col md={{ span: 4, offset: 0 }}>
            <div className="Home__callForPaper p-4">
              <h2 className="mb-4">{t('pages.home.callForPaper')}</h2>
              {callForPapers.map((source, i) => (
                <div dangerouslySetInnerHTML={{ __html: source }} key={i} />
              ))}
              <LangLink to="/submit" className="btn btn-block btn-primary btn-lg">
                {t('pages.home.submitAbstract')}
              </LangLink>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 2 }}>
            <h2 className="my-5">{t('pages.home.editorialBoardMembers')}</h2>
          </Col>
        </Row>
        <Row>
          {editorialTeam.map((person, i) => (
            <Col key={i} md={{ span: 4, offset: i % 2 === 0 ? 2 : 0 }}>
              <ArticleCellContent hideNum hideIdx={false} content={person} idx="▲" />
            </Col>
          ))}
        </Row>
        <Row className="mt-5">
          {/* }<Col md={{ offset: 2, span:10 }}>
          <h4 className="mt-5 mb-3 font-italic">{t('pages.home.editorialBoardMembersAlphabeticList')}</h4>
        </Col>*/}
          {editorialBoard.map((content, i) => (
            <Col key={i} md={{ span: 4, offset: i % 2 === 0 ? 2 : 0 }}>
              <ArticleCellContent hideNum hideIdx={false} content={content} idx="▲" />
            </Col>
          ))}
        </Row>
      </Container>

      {!IsMobile && (
        <Container>
          <Row>
            <Col {...BootstrapFullColumLayout}>
              <h2 className="my-5">{t('pages.home.journalRoadmap')}</h2>
              <p className="mb-3 d-none d-md-block">{t('pages.home.editorialRoadmap')} ⤵</p>
              <HomeMilestones isPortrait={IsPortrait} extent={['2020-09-30', '2023-11-30']} />
              <p className="mt-3 d-none d-md-block">{t('pages.home.technicalRoadmap')} ⤴</p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  )
}

const PrefetchHome = () => (
  <StaticPageLoader url={import.meta.env.VITE_WIKI_HOMEPAGE} delay={150} Component={Home} />
)
export default PrefetchHome
