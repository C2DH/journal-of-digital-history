import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './ArticleHeader.module.scss';

class ArticleCover extends Component{
  constructor(props) {
    super(props);
    this.state = {
      scrollY: 0
    };
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
  
  shouldComponentUpdate(nextProps, { scrollY }) {
    return scrollY < window.innerHeight;
  }

  handleScroll(event) {
    this.setState({ scrollY: window.scrollY });
  }

  render() {
    const { scrollY } = this.state;
    const { url } = this.props;
    const opacity = Math.max(0.3, Math.min(0.85, 2.5*scrollY / window.innerHeight))
    return(
      <div className='h-100 w-100 position-absolute' style={{
        transform: `translate(0, ${scrollY/2}px)`,
      }}>
        <div className='h-100 w-100 position-absolute' style={{
          backgroundImage: `url(${url})`,
          backGroundSize: 'cover',
          backgroundPosition : 'center'
        }}></div>
        <div className='h-100 w-100 position-absolute' style={{
          zIndex: 1,
          backgroundColor: `rgba(0,0,0,${opacity})`
        }}></div>
      </div>
    )
  }
}

export default function ArticleHeader() {
  return(
    <div className={styles.ArticleHeader}>
      <div className='d-flex align-items-center position-relative' style={{paddingTop: '200px', paddingBottom: '100px'}}>
        <div className='position-absolute h-100 w-100' style={{overflow: 'hidden'}}>
          <ArticleCover url='https://live.staticflickr.com/5316/13940668626_9146f941ec_k_d.jpg' />
        </div>
        <Container >
          <Row>
            <Col md={6}>
              <h1>Le centenaire de la batallie de Verdun on Twitter</h1>
            </Col>
            <Col md={6}>
            <div className={styles.Author}><b>Frédéric Clavert</b>, University of Luxembourg</div>
            <h2 className='mt-4'>The Centenary of the Great War gave birth to numerous commemorations. On the on-line social network Twitter, millions of tweets mention it. By analyzing data collected on Twitter, this article, after giving an overview of the traces of the centenary on this network, looks at the case of the polemical commemorations of the Battle of Verdun.</h2>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}