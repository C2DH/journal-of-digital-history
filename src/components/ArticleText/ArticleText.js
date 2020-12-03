import React from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import styles from './ArticleText.module.scss'

const ArticleCell = (props) => {
  const { type, content='', idx, outputs=[] } = props
  if (type === 'markdown') {
    return (
      <div class={styles.ArticleCell}>
        <div class={styles.ParagraphNumber}>{idx}</div>
        <div dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    )
  }
  if (type === 'code') {
    return (
      <div class={styles.ArticleCell}>
        <div class={styles.ParagraphNumber}>{idx}</div>
        <pre className="bg-dark text-white p-3">{content}</pre>
        <pre>{JSON.stringify(outputs)}</pre>
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

const ArticleText = ({ articleTree }) => {
  console.info('ArticleText render:', articleTree.paragraphs.length, 'cells');
  
  return (
    <div className='bg-light mt-5 pt-5'>
      {articleTree.paragraphs.map((paragraph, i) => {
        return (
          <Container className="mt-5" key={i}>
            <Row>
              <Col lg={{span:7, offset:2}}>
                <ArticleCell content={paragraph.content} type={paragraph.type} outputs={paragraph.outputs} idx={paragraph.idx}/>
              </Col>
            </Row>
          </Container>
        )
      })}
    </div>
  )
}

export default ArticleText;