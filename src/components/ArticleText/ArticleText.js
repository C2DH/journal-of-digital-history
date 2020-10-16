import React from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import MarkdownIt from 'markdown-it'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

// markdownParser.r heading
const ToC = (md) => {
  md.core.ruler.push('anchor', (state) => {
    state.tokens
      .filter(t => t.type === 'heading_open')
      .forEach((token, i) => {
        console.info(token, i, state.tokens[i + 1])
      })
  })
}
markdownParser.use(ToC)

const ArticleCell = (props) => {
  const { type, source=[], outputs=[] } = props
  if (type === 'markdown') {
    const rendered = markdownParser.render(source.join('\n\n'))
    return (<div dangerouslySetInnerHTML={{__html: rendered}} />)
  }
  if (type === 'code') {
    return (
      <div>
        <pre className="bg-dark text-white p-3">{source}</pre>
        {outputs.length && outputs.map((output,i) => {
          return (
            <blockquote className='pl-3 py-2 pr-2' style={{borderLeft: '2px solid', background:'var(--gray-200)'}}>
              <div>{output.output_type} {output.ename}</div>
              <div>{output.evalue}</div>
            </blockquote>
          )
        })}
      </div>
    )
  }
  return (<div>unknown type: {type}</div>)
}

const ArticleText = (props) => {
  const { paragraphs = [] } = props;
  console.info('ArticleText render:', paragraphs.length, 'cells');

  return (
    <div className='bg-light mt-5 pt-5'>
      {paragraphs.map((paragraph, i) => {
        return (
          <Container className="mt-5" key={i}>
            <Row>
              <Col lg={6}>
                <ArticleCell source={paragraph.source} type={paragraph.cell_type} outputs={paragraph.outputs}/>
              </Col>
            </Row>
          </Container>
        )
      })}
    </div>
  )
}

export default ArticleText;