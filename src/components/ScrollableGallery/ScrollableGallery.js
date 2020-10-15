import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { Container } from 'react-bootstrap';
import { useStore } from '../../store';

class ScrollableGallery extends Component {
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
    console.info('onStepEnter', data, direction, this.props.id)
    this.setState({ data, direction });
    useStore.setState({ backgroundColor: '#ddd' });
  };
  onStepExit = ({ data, direction }) => {
    console.info('onStepExit', data, direction, this.props.id)
    if(data === 0 && direction === 'up') {
      useStore.setState({ backgroundColor: 'white' });
    }
    // this.setState({ data, direction });
  };
  
  render() {
    const { progress, data } = this.state;
    const { offsetTop, title, steps=[] } = this.props;
    console.info('loaded', steps)
    return (
      <div>
        <div style={{ position: 'sticky', top: offsetTop }}>
          <h2 className="text-center">{title} {steps.length}</h2>
        </div>
        <div style={{ overflow: 'hidden' }}>
        <Scrollama 
          onStepEnter={this.onStepEnter}
          onStepExit={this.onStepExit}
          onStepProgress={this.onStepProgress}
          offset={0.6}
          threshold={0}>
          {steps.map((_, stepIndex) => (
            <Step data={stepIndex} key={stepIndex}>
              <div
                style={{
                  margin: '50vh 0',
                  border: '1px solid gray',
                  color: 'black',
                  opacity: data === stepIndex ? 1 : 0.2,
                }}
              >
                <Container>
                  this is a lot of text indeed.
                  {_.title}
                </Container>
                I'm a Scrollama Step of index {stepIndex} {data} {progress}
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>
      </div>
    )
  }
}

export default ScrollableGallery;