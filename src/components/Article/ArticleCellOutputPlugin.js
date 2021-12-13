import React from 'react'

class ArticleCellOutputPlugin extends React.Component {
  constructor(props) {
    super(props)
    console.info('ArticleCellOutputPlugin created for cell idx:', props.cellIdx)
  }

  componentDidMount() {
    console.info('ArticleCellOutputPlugin @componentDidMount for cell idx:', this.props.cellIdx)
    this.el.innerHTML = this.props.trustedInnerHTML
  }

  componentDidUpdate(prevProps) {
    console.info('ArticleCellOutputPlugin @componentDidUpdate for cell idx:', this.props.cellIdx)
    if (prevProps.trustedInnerHTML !== this.props.trustedInnerHTML) {
      console.info('ArticleCellOutputPlugin changed.', prevProps.trustedInnerHTML)
    }
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}

export default ArticleCellOutputPlugin
