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
  ArticleStatusPublished,
  BootstrapMainColumnLayout,
  BootstrapFullColumLayout,
} from '../../constants'
import '../../styles/components/Article/ArticleHeader.scss'
import ArticleDataModal from './ArticleDataModal'

const ArticleHeader = ({
  title = [],
  abstract = [],
  keywords = [],
  collaborators = [],
  contributor = [],
  disclaimer = [],
  publicationDate = new Date(),
  publicationStatus = ArticleStatusDraft,
  className = '',
  issue,
  variant,
  url,
  binderUrl,
  repositoryUrl,
  bibjson,
  children,
  isPreview = true,
  ignorePublicationStatus = false,
  // category is a string
  category = null,
}) => {
  const { t } = useTranslation()
  const keywordsCleaned = keywords.reduce((acc, d) => {
    if (typeof d === 'string') {
      return acc.concat(d)
    }
    return acc.concat(d.source.join(',').split(/\s*[,;]\s*/g))
  }, [])
  return (
    <Container className={`ArticleHeader ${className}`}>
      <Row>
        <Col {...BootstrapFullColumLayout} className="d-flex  justify-content-between">
          {!ignorePublicationStatus && (
            <div className="mb-3">
              {t(`pages.article.status.${publicationStatus}`)}
              {publicationStatus === ArticleStatusPublished ? (
                <span>
                  {' '}
                  &mdash; <LangLink to={`issue/${issue.pid}`}>{issue?.name}</LangLink>
                </span>
              ) : null}
              <br />
              <b>{publicationDate !== null && publicationDate.getFullYear()}</b>
            </div>
          )}
          {typeof category === 'string' && (
            <div className="mb-3">
              <em>{t(category)}</em>
            </div>
          )}
          <div className="align-items-start d-flex justify-content-end">
            <ArticleCitation disabled={isPreview} bibjson={bibjson} />
            <span className="mx-1"></span>
            <ArticleDataModal url={url} binderUrl={binderUrl} repositoryUrl={repositoryUrl} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapMainColumnLayout}>
          <div
            className={`ArticleHeader_title ${
              ignorePublicationStatus ? 'mb-3' : 'my-3'
            } ${variant}`}
          >
            {title.map((paragraph, i) => (
              <ArticleCellContent key={i} {...paragraph} hideIdx hideNum />
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        {contributor.map((author, i) => (
          <Col
            key={i}
            md={{ offset: i % 2 === 0 ? 2 : 0, span: 4 }}
            className="ArticleHeader_contributor"
          >
            <ArticleCellContent {...author} hideIdx hideNum />
          </Col>
        ))}
      </Row>
      <Row>
        {collaborators.map((d, i) => (
          <Col key={i} {...BootstrapColumLayout} className="ArticleHeader_collaborator">
            <ArticleCellContent {...d} hideIdx hideNum />
          </Col>
        ))}
      </Row>
      {abstract.length > 0 && !ignorePublicationStatus ? (
        <Row className="mt-5">
          <Col {...BootstrapColumLayout}>
            <h3>{t('pages.article.abstract')}</h3>
            <ArticleKeywords keywords={keywordsCleaned} />

            <div className="ArticleHeader_abstract">
              {abstract.map((paragraph, i) => (
                <ArticleCellContent key={i} {...paragraph} hideIdx hideNum />
              ))}
            </div>
          </Col>
        </Row>
      ) : null}
      {abstract.length > 0 && ignorePublicationStatus && (
        <Row className="mt-5">
          <Col {...BootstrapColumLayout}>
            <div className="ArticleHeader_abstract">
              {abstract.map((paragraph, i) => (
                <ArticleCellContent key={i} {...paragraph} hideIdx hideNum />
              ))}
            </div>
          </Col>
        </Row>
      )}
      {!!url && (
        <Row>
          <Col {...BootstrapColumLayout}>
            <div className="ArticleHeader_url p-2 border border-warning">
              <p
                dangerouslySetInnerHTML={{
                  __html: t('pages.article.loadedFromRemoteURL', { url }),
                }}
              />
              <LangLink to="/notebook-viewer-form">{t('pages.article.tryRemoteURL')}</LangLink>
            </div>
          </Col>
        </Row>
      )}
      {disclaimer.length ? (
        <Row>
          <Col {...BootstrapColumLayout}>
            <div className="bg-warning p-3">
              {disclaimer.map((paragraph, i) => (
                <ArticleCellContent key={i} {...paragraph} hideIdx hideNum />
              ))}
            </div>
          </Col>
        </Row>
      ) : null}
      {children ? (
        <Row>
          {' '}
          <Col {...BootstrapColumLayout}>{children}</Col>
        </Row>
      ) : null}
    </Container>
  )
}

export default ArticleHeader
