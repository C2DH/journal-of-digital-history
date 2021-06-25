import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from './ArticleCellContent'
import LangLink from '../../components/LangLink'
import { BootstrapColumLayout } from '../../constants'


const ArticleHeader = ({ variant, title=[], abstract=[], keywords=[], contributor=[], disclaimer=[], publicationDate=new Date(), url, doi, children }) => {
  const { t } = useTranslation()
  const keywordsAsLinks = keywords.reduce((acc, d) => {
    return acc.concat(d.source.join(',').split(/\s*[,;]\s*/g))
  }, [])
  return (
    <Container className="ArticleHeader">
      <Row>
        <Col {...BootstrapColumLayout}>
          {doi
            ? <h3 className="mb-3">{t('pages.article.publicationDate')} {t('dates.short', {date: publicationDate})}</h3>
            : <h3 className="mb-3">{t('pages.article.notYetPublished')} | ({publicationDate.getFullYear()})</h3>
          }
          <div className={`ArticleHeader_title my-3 ${variant}`}>
          {title.map((paragraph, i) => (
            <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
          ))}
          </div>
        </Col>
      </Row>
      <Row>
      {contributor.map((author,i) => (
        <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}}>
           <ArticleCellContent {...author} hideIdx hideNum/>
        </Col>
      ))}
      </Row>
      {abstract.length
        ? (
          <Row className="mt-5">
            <Col {...BootstrapColumLayout}>
              <h3>{t('pages.article.abstract')}</h3>
              <div className="ArticleHeader_keywords mb-3">
                {keywordsAsLinks.map((keyword, i) => (
                  <LangLink key={i} to={`/tag/${keyword}`} className="mr-2">{keyword}</LangLink>
                ))}
              </div>
              <div className="ArticleHeader_abstract">
                {abstract.map((paragraph, i) => (
                  <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
                ))}
              </div>
            </Col>
          </Row>
        ):null
      }
      {!!url && (
        <Row>
          <Col {...BootstrapColumLayout}>
            <div className="ArticleHeader_url p-2 border border-warning">
              <p  dangerouslySetInnerHTML={{
                __html: t('pages.article.loadedFromRemoteURL', { url })
              }} />
              <LangLink to='/notebook'>{t('pages.article.tryRemoteURL')}</LangLink>
            </div>
          </Col>
        </Row>
      )}
      {disclaimer.length
        ? (
          <Row>
            <Col {...BootstrapColumLayout}>
              <div className="bg-warning p-3">
              {disclaimer.map((paragraph, i) => (
                <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
              ))}
              </div>
            </Col>
          </Row>
        )
        : null
      }
      {children
        ? <Row> <Col {...BootstrapColumLayout}>{children}</Col></Row>
        : null}
  </Container>
  )
}

export default ArticleHeader
