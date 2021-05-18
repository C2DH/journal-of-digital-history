import React from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleToC from './ArticleToC'
import ArticleCell from './ArticleCell'
import ArticleCellGroup from './ArticleCellGroup'
import ArticleShadowLayer from './ArticleShadowLayer'
import { RoleHidden } from '../../constants'


class ArticleText extends React.PureComponent {
  state = {
    data: 0,
    steps: [],
    progress: 0,
    scrolled: false,
  }

  componentDidUpdate() {
    clearInterval(this.timerID)
  }
  componentDidMount() {
    clearInterval(this.timerID)
    window.dispatchEvent(new Event('resize'));
    let c = 0;
    this.timerID = setInterval(() => {
      c += 1
      window.dispatchEvent(new Event('resize'));
      if (c > 10) {
        clearInterval(this.timerID)
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  onStepEnter = ({ element, data }) => {
    this.setState({ data });
  }

  onStepExit = ({ element, data }) => {
    console.info('@onStepExit')
    // this.setState({ data });
  }

  onStepProgress = ({ progress }) => {
    this.setState({ progress })
  };

  render() {
    const { paragraphs, paragraphsPositions, headingsPositions, onDataHrefClick, debug, height, width,
      title, abstract, keywords, contributor, publicationDate, url, disclaimer,
    } = this.props;
    const { progress, data } = this.state;
    const currentLayer = paragraphs[data]?.layer;

    return (
      <div className={`mt-5 ArticleText ${currentLayer}`}>
        <div className='ArticleText_toc' style={{
          position: 'sticky',
          top: 160
        }}>

          <Container fluid style={{position: 'absolute'}}><Row><Col {...{
            md: { offset: 10, span: 2}
          }}>
            <div className="d-flex flex-row-reverse">
              <div className="mr-3">
                {/* <div className="rounded border border-dark">N</div>*/}
                <ArticleToC
                  headingsPositions={headingsPositions}
                  steps={paragraphs} active
                  step={paragraphsPositions[data]}
                />
              </div>
            </div>
          </Col></Row></Container>
        </div>
        <ArticleShadowLayer height={height} width={width} title={title}
          abstract={abstract}
          keywords={keywords}
          contributor={contributor}
          publicationDate={publicationDate}
          url={url}
          disclaimer={disclaimer} />
        <div className="ArticleText_scrollama">
        <Scrollama
          onStepEnter={this.onStepEnter}
          onStepExit={this.onStepExit}
          progress
          onStepProgress={this.onStepProgress}
          offset={.5}
          threshold={0}
        >
        {paragraphs.map((cell, i) => {
          if(cell.role === RoleHidden) {
            return (
              <Step data={i} key={i}>
                <div style={{height: 1, overflow: 'hidden'}}>&nbsp;</div>
              </Step>
            )
          }
          const cellStyle = {
            backgroundColor: cell.metadata?.jdh?.backgroundColor ?? 'transparent'
          }
          const cellProgress = data > i
            ? 1
            : data < i
              ? 0
              : progress
          if (cell.type === 'group') {
            return (
              <Step data={i} key={i}>
                <div>
                <ArticleCellGroup
                  cellGroup={cell}
                  progress={cellProgress}
                  step={i}
                  currentStep={data}
                  key={i}
                  onDataHrefClick={onDataHrefClick}
                  height={height * .4}
                  width={width}
                />
                </div>
              </Step>
            )
          }
          return (
            <Step data={i} key={i}>
              <div className={`ArticleText_ArticleParagraph ${data === i? ' active': ''} ${cell.layer}`}
                style={{ ...cellStyle }}
                id={`C-${cell.idx}`}
                onClick={(e) => {
                  const dataHref = e.target.getAttribute('data-href')
                  onDataHrefClick({ dataHref, idx: cell.idx })
                }}
              >&nbsp;
                {debug ? (<div>layer:{cell.layer} role:{cell.role} section:{cell.section}</div>): null}
                <ArticleCell {...cell} hideNum={cell.layer === 'metadata'} idx={cell.idx} progress={cellProgress} active={data === i}/>
              </div>
            </Step>
          )
        })}
        </Scrollama>
        </div>
      </div>
    )
  }
}

export default ArticleText;
