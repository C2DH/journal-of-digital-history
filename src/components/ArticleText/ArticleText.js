import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { Container, Row, Col} from 'react-bootstrap'

class ArticleText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0,
      direction: '',
      steps: [],
      progress: 0,
    };
  }
  
  onStepProgress = ({ progress }) => {
    this.setState({ progress });
  };
  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  onStepEnter = ({ data, direction }) => {
    this.setState({ data, direction });
  };
  onStepExit = ({ data, direction }) => {
    console.info('onStepExit', data, direction)
    // this.setState({ data, direction });
  };
  
  render() {
    // const { progress, data } = this.state;
    const { paragraphs = [] } = this.props;
    console.info(paragraphs);
    return (
      <div className='bg-light mt-5 pt-5'>
        {paragraphs.map((paragraph, i) => {
          return (
            <Container className="mt-5">
              <Row>
                <Col lg={6}>
                  <p><b>{i}</b> {paragraph.cell_type}</p>
                  { paragraph.cell_type === 'code' && (
                    <pre className="bg-dark text-white p-3">{paragraph.source}</pre>
                  )}
                  { paragraph.cell_type === 'markdown' && (
                    <p>{paragraph.source}</p>
                  )}
                </Col>
              </Row></Container>
          )
        })}
        {/*
          <div style={{ position: 'sticky', top: '10vh', width: '5wv',border: '1px solid orchid' }}>
            I'm sticky. The current triggered step index is: {data}
          </div>
          // <div style={{ overflow: 'hidden' }}>
          
          // <Scrollama 
          //   onStepEnter={this.onStepEnter}
          //   onStepExit={this.onStepExit}
          //   onStepProgress={this.onStepProgress}
          //   offset={0.42}
          //   threshold={0}>
          //   {[1, 2, 3, 4].map((_, stepIndex) => (
          //     <Step data={stepIndex} key={stepIndex}>
          //       <div
          //         style={{
          //           margin: '50vh 0',
          //           border: '1px solid gray',
          //           opacity: data === stepIndex ? 1 : 0.2,
          //         }}
          //       >
          //         I'm a Scrollama Step of index {stepIndex} {data} {progress}
          //       </div>
          //     </Step>
          //   ))}
          // </Scrollama>
          // </div>
        */}
      </div>
    )
  }
}

export default ArticleText;