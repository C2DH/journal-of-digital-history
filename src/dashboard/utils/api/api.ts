import { DateTime } from 'luxon'

import { APIResponse, Callforpaper } from '../types'
import api from './headers'

const modifyAbstractStatusWithEmail = async (pid: string, body: Record<string, any>) => {
  console.info('PATCH [modifyAbstractStatusWithEmail]')

  return api
    .patch(`/api/abstracts/${pid}/status`, body)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const modifyStatus = async (body: { pids: string[]; status: string }, item: string) => {
  console.info(`PATCH [modifyStatus] - ${item} `)

  return api
    .patch(`/api/${item}/status`, body)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getArticlesByStatus = async (status: string): APIResponse => {
  console.info(`GET [getArticlesByStatus] - ${status} `)

  return api
    .get(`/api/articles?status=${status}`)
    .then((res) => {
      console.info(`Articles for ${status}`, res.data)
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getArticlesByStatusAndIssues = async (issue: number, status: string): APIResponse => {
  console.info(`GET [getArticlesByStatusAndIssues] - ${status} ${issue} `)

  return api
    .get(`/api/articles?issue=${issue}&status=${status}`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getAbstractsByStatusAndCallForPapers = async (
  callforpaper: number,
  status: string,
): APIResponse => {
  console.info(`GET [getAbstractsByStatusAndCallForPapers] - ${callforpaper} `)

  return api
    .get(`/api/abstracts/?callpaper=${callforpaper}&status=${status}`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getAbstractsSubmittedToOJS = async (): Promise<{ count: number }> => {
  console.info(`GET [getAbstractsSubmittedToOJS ]`)

  return api
    .get(`/api/articles/ojs/submissions`)
    .then((res) => {
      return res.data
    })
    .catch((err) => console.error(err))
}

const postArticletoSubmissionOJS = async (body: { pid: string }) => {
  console.info(`POST [postArticletoSubmissionOJS]`)

  return api
    .post('/api/articles/ojs/submission', body)
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.error(err)
      throw err.response.data
    })
}

const getAdvanceArticles = async (): APIResponse => {
  console.info(`GET [getAdvanceArticles]`)

  return api
    .get(`/api/articles/advance`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getCallforpaperWithDeadlineOpen = async (): Promise<Callforpaper[]> => {
  console.info(`GET [getCallforpaperWithDeadlineOpen]`)

  const now = DateTime.now()

  return api
    .get(`/api/callforpaper`)
    .then((res) => {
      const result = res.data.results
      return result.filter((cfp: Callforpaper) => {
        const dt = DateTime.fromISO(cfp.deadline_article)
        const isFuture = dt > now
        return isFuture
      })
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const postBlueskyCampaign = async (body: {
  repository_url: string
  article_url: string
  schedule_main: string[]
}) => {
  console.info('POST [postBlueskyCampaign]')

  return api
    .post('/api/articles/bluesky', body)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const postFacebookCampaign = async (body: {
  repository_url: string
  article_url: string
  schedule_main: string[]
}) => {
  console.info('POST [postFacebookCampaign]')

  return api
    .post('/api/articles/facebook', body)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getTweetContent = async (pid: string): Promise<{ content: string }> => {
  console.info('GET [getTweetContent]')

  return api
    .get(`/api/articles/tweet?pid=${pid}`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getSocialMediaCover = async (pid: string): Promise<{ download_url: string }> => {
  console.info('GET [getSocialMediaCover]')

  return api
    .get(`/api/articles/cover?pid=${pid}`)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const patchArticleStatus = async (body: { status: string }, pid: string) => {
  console.info('PATCH [patchArticleStatus]')

  return api
    .patch(`/api/articles/${pid}/status`, body)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const sendArticleToCopyeditor = async (body: { pid: string; body: string }) => {
  console.info('POST [sendArticleToCopyeditor]')

  return api
    .post(`/api/articles/docx/email`, body)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export {
  getAbstractsByStatusAndCallForPapers,
  getAbstractsSubmittedToOJS,
  getAdvanceArticles,
  getArticlesByStatus,
  getArticlesByStatusAndIssues,
  getCallforpaperWithDeadlineOpen,
  getSocialMediaCover,
  getTweetContent,
  modifyAbstractStatusWithEmail,
  modifyStatus,
  patchArticleStatus,
  postArticletoSubmissionOJS,
  postBlueskyCampaign,
  postFacebookCampaign,
  sendArticleToCopyeditor,
}
