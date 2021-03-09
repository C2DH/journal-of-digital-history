import React from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleToC from './ArticleToC'
import ArticleCell from './ArticleCell'


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
    const { contents } = this.props;
    const { progress, data } = this.state;
    const currentLayer = contents[data].layer;
    return (
      <div className={`mt-5 ArticleText ${currentLayer}`}>
        <div className='ArticleText_toc' style={{
          position: 'sticky',
          top: 0
        }}>
          <Container fluid style={{position: 'absolute'}}><Row><Col {...{
            md: { offset: 10, span: 2}
          }}>
            <div className="d-flex flex-row-reverse">
              <div className="mr-3">
                <div className="rounded border border-dark">N</div>
                <ArticleToC
                  steps={contents} active
                  step={data} progress={progress}
                />
              </div>
              <div className="mr-3">
                <div className="rounded border border-dark">H {progress}</div>

              </div>
            </div>
          </Col></Row></Container>
        </div>
        <div className="ArticleText_scrollama">
        <Scrollama
          onStepEnter={this.onStepEnter}
          onStepExit={this.onStepExit}
          progress
          onStepProgress={this.onStepProgress}
          offset={.5}
          threshold={0}
        >
        {contents.map((cell, i) => {
          const cellStyle = {
            backgroundColor: cell.metadata.jdh?.backgroundColor ?? 'transparent'
          }
          const cellProgress = data > i
            ? 1
            : data < i
              ? 0
              : progress
          return (
            <Step data={i} key={i}>
              <div className={`ArticleText_ArticleParagraph ${data === i? ' active': ''} ${cell.layer}`}
                style={{ ...cellStyle }}
              >&nbsp;
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
