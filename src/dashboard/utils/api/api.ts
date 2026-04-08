import { DateTime } from 'luxon'

import { APIResponse, Callforpaper } from '../types'
import api from './headers'

/**
 * Modifies the status of an abstract and sends an email notification to jdh.admin and the author of the abstract.
 *
 * @param pid - The unique identifier of the abstract.
 * @param body - Object containing the new status and email details.
 * @returns A promise that resolves with the API response.
 */
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

/**
 * Updates the status of multiple items (articles or abstracts).
 *
 * @param body - Object containing an array of PIDs and the new status.
 * @param item - The item type ('articles' or 'abstracts').
 * @returns A promise that resolves with the API response.
 */
const patchStatus = async (body: { pids: string[]; status: string }, item: string) => {
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

/**
 * Retrieves all articles filtered by status.
 *
 * @param status - The status to filter articles by.
 * @returns A promise that resolves with the filtered articles data.
 */
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

/**
 * Retrieves articles filtered by both issue ID and status.
 *
 * @param issue - The issue number to filter by.
 * @param status - The status to filter articles by.
 * @returns A promise that resolves with the filtered articles data.
 */
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

/**
 * Retrieves abstracts filtered by both call for papers ID and status.
 *
 * @param callforpaper - The call for papers ID to filter by.
 * @param status - The status to filter abstracts by.
 * @returns A promise that resolves with the filtered abstracts data.
 */
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

/**
 * Retrieves the count of abstracts that have been submitted to OJS.
 *
 * @returns A promise that resolves with an object containing the submission count.
 */
const getAbstractsSubmittedToOJS = async (): Promise<{ count: number }> => {
  console.info(`GET [getAbstractsSubmittedToOJS ]`)

  return api
    .get(`/api/articles/ojs/submissions`)
    .then((res) => {
      return res.data
    })
    .catch((err) => console.error(err))
}

/**
 * Submits an article to OJS for peer review.
 *
 * @param body - Object containing the article PID to submit.
 * @returns A promise that resolves with the submission response.
 */
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

/**
 * Retrieves all advance articles (=articles in publish state belonging to an issue which is not published).
 *
 * @returns A promise that resolves with the advance articles data.
 */
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

/**
 * Retrieves all call for papers with deadlines that are still open.
 *
 * @returns A promise that resolves with an array of open call for papers.
 */
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

/**
 * Creates a scheduled Bluesky social media campaign for an article.
 *
 * @param body - Object containing repository URL, article URL, and schedule.
 * @returns A promise that resolves with the campaign creation response.
 */
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

/**
 * Creates a scheduled Facebook social media campaign for an article.
 *
 * @param body - Object containing repository URL, article URL, and schedule.
 * @returns A promise that resolves with the campaign creation response.
 */
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

/**
 * Retrieves the tweets.md content for an article from the GitHub repository.
 *
 * @param pid - The unique identifier of the article.
 * @returns A promise that resolves with an object containing the tweet content.
 */
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

/**
 * Retrieves the social media cover image from its GitHub repository.
 *
 * @param pid - The unique identifier of the article.
 * @returns A promise that resolves with an object containing the cover download URL.
 */
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

/**
 * Updates the status of a specific article.
 *
 * @param body - Object containing the new status.
 * @param pid - The unique identifier of the article.
 * @returns A promise that resolves with the updated article data.
 */
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

/**
 * Sends an article in DOCX file to the copy editor via email.
 *
 * @param body - Object containing the article pid(string) and body(string) content.
 * @returns A promise that resolves with the email sending response.
 */
const sendArticleToCopyeditor = async (body: Record<string, any>) => {
  console.info('POST [sendArticleToCopyeditor]')

  return api
    .post(`/api/articles/docx/email`, body)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err.response.data
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
  patchArticleStatus,
  patchStatus,
  postArticletoSubmissionOJS,
  postBlueskyCampaign,
  postFacebookCampaign,
  sendArticleToCopyeditor,
}
