import React from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { Container, Row, Col} from 'react-bootstrap'
import ArticleCell from './ArticleCell'
import ArticleToC from './ArticleToC'
import { BootstrapColumLayout } from '../../constants'
import '../../styles/article.scss'


const ArticleParagraph = ({cell, idx}) => (
  <Container className="mt-5">
    <Row>
      <Col {... BootstrapColumLayout}>
        <ArticleCell {...cell} idx={idx}/>
      </Col>
    </Row>
  </Container>
)

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

    return (
      <div className='mt-5 pt-5 ArticleText'>
        <ArticleToC steps={contents} step={data} progress={progress} />
        <Scrollama
          onStepEnter={this.onStepEnter}
          onStepExit={this.onStepExit}
          progress
          onStepProgress={this.onStepProgress}
          offset={.5}
          threshold={0}
        >
        {contents.map((cell, i) => {
          return (
            <Step data={i} key={i}>
              <div className={`ArticleText_ArticleParagraph ${data === i? ' active': ''}`}>&nbsp;
                <ArticleParagraph cell={cell} idx={cell.idx}/>
              </div>
            </Step>
          )
        })}
        </Scrollama>
      </div>
    )
  }
}

export default ArticleText;
