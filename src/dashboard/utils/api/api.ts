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
      // console.info(`Articles for status: ${status} for issue id: ${issue}`, res.data)
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
      // console.info(`Abstracts for callforpaper id: ${callforpaper}`, res.data)
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
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

export {
  getAbstractsByStatusAndCallForPapers,
  getAdvanceArticles,
  getArticlesByStatus,
  getArticlesByStatusAndIssues,
  getCallforpaperWithDeadlineOpen,
  modifyAbstractStatusWithEmail,
  modifyStatus,
}
