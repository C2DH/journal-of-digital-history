import React from 'react'
import PropTypes from 'prop-types'
import { useGetRawContents } from '../logic/api/fetchData'
import Loading from './Loading'
import NotFound from './NotFound'
import WikiStaticPage from './WikiStaticPage'
import './Page.css'

const Page = ({ match }) => {
  const { status, data } = useGetRawContents({
    url: import.meta.env.VITE_WIKI_AVAILABLE_PAGES,
    delay: 500,
  })

  const { pageId } = match.params

  if (status !== 'success') {
    return <Loading />
  }
  const availablePages = data.split('\n').map((d) => {
    // extract link from markdown text using a regexp
    // [The Journal of Digital History switches to single‐blind peer review](https://github.com/C2DH/journal-of-digital-history/wiki/The-Journal-of-Digital-History-switches-to-single-blind-peer-review)
    const title = d.match(/\[(.*?)\]/)
    const url = d.match(/\((.*?)\)/)
    if (!url || !title) {
      return null
    }
    const wikiRawUrl = `${import.meta.env.VITE_WIKI_ROOT}/${pageId}.md`
    return {
      title: title[1],
      url: url[1],
      rawUrl: wikiRawUrl,
      pageId: url[1].split('/').pop(),
    }
  })
  console.debug('[Page]', pageId, availablePages)
  const page = availablePages.find((d) => d.pageId === pageId)
  if (!page) {
    return <NotFound />
  }
  console.debug('[Page]', pageId, status, data)
  return (
    <WikiStaticPage delay={500} url={page.rawUrl} memoid={1} className="Page">
      <h1 className="my-5">{page.title}</h1>
    </WikiStaticPage>
  )
}

Page.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Page
