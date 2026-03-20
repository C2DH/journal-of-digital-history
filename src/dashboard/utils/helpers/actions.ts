import { patchArticleStatus, patchStatus, postArticletoSubmissionOJS } from '../api/api'
import { RowAction } from '../types'
import { notify } from './notification'

/**
 * Call the API to dispatch the action.
 *
 * @param action - The action which should be triggered.
 * @param pid - The PID of the article or abstract related to the action.
 * @param t - Hook from useTranslate to get the translation of the notification.
 */
const callAPI = async (action: string, pid: string, t: any) => {
  switch (action) {
    case 'Ojs':
      notify('warning', t('notification.ojs.warning'))
      await postArticletoSubmissionOJS({ pid: pid })
        .then(async (res) => {
          notify('success', t('notification.ojs.success'), res.data.message, 7000)
          await patchArticleStatus({ status: 'PEER_REVIEW' }, pid)
            .then((res) => {
              notify('success', t('notification.status.success.article'), '', 7000)
            })
            .catch((error) => {
              console.error('Failed to send Article to OJS :', error)
              notify('error', t('notification.status.error.article'), error.message, 7000)
            })
        })
        .catch((error) => {
          console.error('Failed to send Article to OJS :', error)
          notify('error', t('notification.status.error.article'), error.details, 7000)
        })
      break
    case 'Submitted':
    case 'Accepted':
    case 'Declined':
    case 'Abandoned':
    case 'Suspended':
      await patchStatus({ pids: [pid], status: action.toLowerCase() }, 'abstracts')
        .then((res) => {
          notify('success', t('notification.status.success.abstract'), '', 0, pid)
        })
        .catch((error) => {
          console.error('Failed to send Article to OJS :', error)
          notify('error', t('notification.status.error.abstract'), error.message)
        })
      break
    case 'Writing':
    case 'Technical_review':
    case 'Peer_review':
    case 'Copy_editing':
    case 'Design_review':
    case 'Published':
      await patchArticleStatus({ status: action.toUpperCase() }, pid)
        .then((res) => {
          notify('success', t('notification.status.success.article'), '', 0, pid)
        })
        .catch((error) => {
          console.error('Failed to send Article to OJS :', error)
          notify('error', t('notification.status.error.article'), error.message)
        })
      break
    default:
      console.warn(`No API call defined for action: ${action}`)
  }
}

/**
 * Send the action to the API
 *
 * @param action - The action which should be triggered.
 * @param row - The data row to populate the modal with details.
 * @param pid - The PID of the article or abstract related to the action.
 * @param t - Hook from useTranslate to get the translation of the notification.
 * @param label - Optional custom label for the action button in the modal.
 */
const defaultAction = (action: string, pid: string, t: any, label?: string) => ({
  label: label || action,
  onClick: () => {
    console.info(`Excuting action: ${action}, for PID: ${pid}`)
    callAPI(action, pid, t)
  },
})

/**
 * Send the action to the API through the modal
 *
 * @param action - The action which should be triggered.
 * @param row - The data row to populate the modal with details.
 * @param pid - The PID of the article or abstract related to the action.
 * @param title - The title of the article or abstract related to the action.
 * @param setModal - Function to open a modal dialog with action details.
 * @param label - Optional custom label for the action button in the modal.
 */
const modalAction = (
  action: string,
  row: any,
  pid: string,
  title: string,
  setModal: (config: { open: boolean; action: any; row: any; pid: string; title: string }) => void,
  label?: string,
) => ({
  label: label || action,
  onClick: () =>
    setModal &&
    setModal({
      open: true,
      action,
      row,
      pid,
      title,
    }),
})

/**
 * Generates a list of row actions based on the current status of the row.
 *
 * @param t - Hook from useTranslate to get the translation of the notification.
 * @param row - The data row from which to determine available actions.
 * @param isArticle - A boolean value to precise is the row correspond to an article or an abstract.
 * @param setModal - Function to open a modal dialog with action details.
 * @returns An array of RowAction objects representing available actions for the row.
 */
function getRowActions(t: any, row: any, isArticle: boolean, setModal: any): RowAction[] {
  const pid = row[0]
  const title = row[1]
  const status = isArticle ? row[4] : row[6]
  const actions: RowAction[] = []

  if (isArticle) {
    switch (status) {
      case 'TECHNICAL_REVIEW':
        actions.push(defaultAction('Ojs', pid, t, 'Send to OJS'))
        break
      case 'PEER_REVIEW':
        actions.push(
          modalAction('Copyediting', row, pid, title, setModal, 'Send docx to copyeditor'),
        )
        break
      case 'DESIGN_REVIEW':
        actions.push(
          modalAction('Copyediting', row, pid, title, setModal, 'Send docx to copyeditor'),
        )
        break
      case 'PUBLISHED':
        actions.push(modalAction('Bluesky', row, pid, title, setModal))
        actions.push(modalAction('Facebook', row, pid, title, setModal))
        break
      default:
        break
    }
  } else {
    switch (status) {
      case 'SUBMITTED':
        actions.push(modalAction('Accepted', row, pid, title, setModal))
        actions.push(modalAction('Declined', row, pid, title, setModal))
        actions.push(modalAction('Abandoned', row, pid, title, setModal))
        break
      case 'ACCEPTED':
        actions.push(modalAction('Suspended', row, pid, title, setModal))
        actions.push(modalAction('Abandoned', row, pid, title, setModal))
        break
      default:
        break
    }
  }

  return actions
}

/**
 * Generates a list of row actions based on the current status of the row.
 *
 * @param row - The data row from which to determine available actions.
 * @param isArticle - A boolean value to precise is the row correspond to an article or an abstract.
 * @param setModal - Function to open a modal dialog with action details.
 * @returns An array of RowAction objects representing available actions for the row.
 */
function getDetailActions(t: any, pid: string, isArticle: boolean): RowAction[] {
  const actions: RowAction[] = []

  if (isArticle) {
    // actions.push(defaultAction('Draft', pid, t, 'Writing'))
    actions.push(defaultAction('Technical_review', pid, t, 'Technical review'))
    actions.push(defaultAction('Peer_review', pid, t, 'Peer review'))
    actions.push(defaultAction('Copy_editing', pid, t, 'Copy editing'))
    // actions.push(defaultAction('Design_review', pid, t, 'Design Review'))
    actions.push(defaultAction('Published', pid, t, 'Published'))
    // actions.push(defaultAction('Social_media', pid, t, 'Social Media'))
    // actions.push(defaultAction('Archived', pid, t, 'Archived'))
  } else {
    actions.push(defaultAction('Submitted', pid, t))
    actions.push(defaultAction('Accepted', pid, t))
    actions.push(defaultAction('Declined', pid, t))
    actions.push(defaultAction('Abandoned', pid, t))
    actions.push(defaultAction('Suspended', pid, t))
  }
  return actions
}

export { getDetailActions, getRowActions }
