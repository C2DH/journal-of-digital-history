import React from 'react'

class ArticleCellOutputPlugin extends React.Component {
  constructor(props) {
    super(props)
    console.info('ArticleCellOutputPlugin Created.', props.trustedInnerHTML)
  }

  componentDidMount() {
    console.info('ArticleCellOutputPlugin mounted.', this.props.trustedInnerHTML)
    this.el.innerHTML = this.props.trustedInnerHTML
  }

  componentDidUpdate(prevProps) {
    console.info('ArticleCellOutputPlugin changed.')
    if (prevProps.trustedInnerHTML !== this.props.trustedInnerHTML) {
      console.info('ArticleCellOutputPlugin changed.', prevProps.trustedInnerHTML)
    }
  }


  componentWillUnmount() {
    // do nothing
    console.info('ArticleCellOutputPlugin componentWillUnmount')
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}

export default ArticleCellOutputPlugin
