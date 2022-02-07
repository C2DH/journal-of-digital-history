import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from './ArticleCellContent'
import ArticleCitation from './ArticleCitation'
import ArticleKeywords from './ArticleKeywords'
import LangLink from '../../components/LangLink'
import {
  BootstrapColumLayout,
  ArticleStatusDraft,
  ArticleStatusPublished
} from '../../constants'
import '../../styles/components/Article/ArticleHeader.scss'

const ArticleHeader = ({
  title=[], abstract=[], keywords=[], collaborators=[], contributor=[], disclaimer=[],
  publicationDate=new Date(),
  publicationStatus=ArticleStatusDraft,
  className='',
  issue,
  variant,
  url,
  bibjson,
  children,
  isPreview=true,
  ignorePublicationStatus=false
}) => {
  const { t } = useTranslation()
  const keywordsCleaned = keywords.reduce((acc, d) => {
    if(typeof d === 'string') {
      return acc.concat(d)
    }
    return acc.concat(d.source.join(',').split(/\s*[,;]\s*/g))
  }, [])
  return (
    <Container className={`ArticleHeader ${className}`}>
      <Row>
        <Col {...BootstrapColumLayout}>
          {!ignorePublicationStatus &&
            <div className="mb-3">
              {t(`pages.article.status.${publicationStatus}`)}
              {publicationStatus === ArticleStatusPublished
                ? <span> &mdash; <LangLink to={`issue/${issue.pid}`}>{issue?.name}</LangLink></span>
                : null}
              <br/>
              <b>{publicationDate !== null && publicationDate.getFullYear()}</b>
            </div>
          }
          {ignorePublicationStatus && (
            <div className="mb-3 mt-4">
              <em>{t(`pages.article.status.${publicationStatus}`)}</em>
            </div>
          )}
          <div className={`ArticleHeader_title ${ignorePublicationStatus ? 'mb-3': 'my-3'} ${variant}`}>
          {title.map((paragraph, i) => (
            <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
          ))}
          </div>
        </Col>
      </Row>
      <Row>
      {contributor.map((author,i) => (
        <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}} className="ArticleHeader_contributor">
           <ArticleCellContent {...author} hideIdx hideNum/>
        </Col>
      ))}
      </Row>
      <Row>
      {collaborators.map((d,i) => (
        <Col key={i}  {...BootstrapColumLayout} className="ArticleHeader_collaborator">
           <ArticleCellContent {...d} hideIdx hideNum/>
        </Col>
      ))}
      </Row>
      {abstract.length > 0 && !ignorePublicationStatus
        ? (
          <Row className="mt-5">
            <Col {...BootstrapColumLayout}>
              <h3>{t('pages.article.abstract')}</h3>
              <ArticleKeywords keywords={keywordsCleaned}/>
              <ArticleCitation disabled={isPreview } bibjson={bibjson} className="my-4 w-100"/>
              <div className="ArticleHeader_abstract">
                {abstract.map((paragraph, i) => (
                  <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
                ))}
              </div>
            </Col>
          </Row>
        ):null
      }
      {abstract.length > 0 && ignorePublicationStatus && (
        <Row className="mt-5">
          <Col {...BootstrapColumLayout}>
          <div className="ArticleHeader_abstract">
            {abstract.map((paragraph, i) => (
              <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
            ))}
          </div>
          </Col>
        </Row>
      )}
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
