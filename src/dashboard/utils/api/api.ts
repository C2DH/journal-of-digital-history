import { APIResponse } from '../types'
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
      console.info(`Articles for status: ${status} for issue id: ${issue}`, res.data)
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

const getAbstractsByCallForPapers = async (callforpaper: number, status: string): APIResponse => {
  console.info(`GET [getAbstractsByCallForPapers] - ${callforpaper} `)

  return api
    .get(`/api/abstracts/?callpaper=${callforpaper}&status=${status}`)
    .then((res) => {
      console.info(`Abstracts for callforpaper id: ${callforpaper}`, res.data)
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export {
  getAbstractsByCallForPapers,
  getArticlesByStatus,
  getArticlesByStatusAndIssues,
  modifyAbstractStatusWithEmail,
  modifyStatus,
}
