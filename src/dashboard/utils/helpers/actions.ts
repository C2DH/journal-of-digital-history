import { patchArticleStatus, postArticletoSubmissionOJS } from '../api/api'
import { RowAction } from '../types'
import { notify } from './notification'

/**
 * Generates a list of row actions based on the current status of the row.
 *
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

  const callAPI = async (action: string) => {
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
      default:
        console.warn(`No API call defined for action: ${action}`)
    }
  }

  const defaultAction = (action: string, label?: string) => ({
    label: label || action,
    onClick: () => {
      console.info(`Excuting action: ${action}, for PID: ${pid}`)
      callAPI(action)
    },
  })

  const modalAction = (action: string, label?: string) => ({
    label: label || action,
    onClick: () =>
      setModal &&
      setModal({
        open: true,
        action,
        row,
        id: pid,
        title,
      }),
  })

  if (isArticle) {
    switch (status) {
      case 'TECHNICAL_REVIEW':
        actions.push(defaultAction('Ojs', 'Send to OJS'))
        actions.push(modalAction('Copyediting', 'Send docx to copyeditor'))
        break
      case 'PUBLISHED':
        actions.push(modalAction('Bluesky'))
        actions.push(modalAction('Facebook'))
        break
      default:
        break
    }
  } else {
    switch (status) {
      case 'SUBMITTED':
        actions.push(modalAction('Accepted'))
        actions.push(modalAction('Declined'))
        actions.push(modalAction('Abandoned'))
        break
      case 'ACCEPTED':
        actions.push(modalAction('Suspended'))
        actions.push(modalAction('Abandoned'))
        break
      default:
        break
    }
  }

  return actions
}

export { getRowActions }
