import { patchArticleStatus, postArticletoSubmissionOJS } from '../api/api'
import { ModalInfo, RowAction, SetNotification } from '../types'

/**
 * Generates a list of row actions based on the current status of the row.
 *
 * @param row - The data row from which to determine available actions.
 * @param isArticle - A boolean value to precise is the row correspond to an article or an abstract.
 * @param setModal - Function to open a modal dialog with action details.
 * @param setNotification - Function to display notifciation for the user.
 * @param setLoadingRow - Function to set the spinner when an action is processed on a specifc row.
 * @returns An array of RowAction objects representing available actions for the row.
 */
function getRowActions(
  row: any,
  isArticle: boolean,
  setModal: (modal: ModalInfo) => void,
  setNotification: SetNotification,
  setLoadingRow: (id: string) => void,
): RowAction[] {
  const pid = row[0]
  const title = row[1]
  const status = isArticle ? row[4] : row[6]
  const actions: RowAction[] = []

  const callAPI = async (action: string) => {
    switch (action) {
      case 'Ojs':
        setLoadingRow(pid)
        await postArticletoSubmissionOJS({ pid: pid })
          .then(async (res) => {
            setNotification({
              type: 'success',
              message: 'Article send to OJS sucessfully for peer review',
              submessage: res.data.message,
            })
            await patchArticleStatus({ status: 'PEER_REVIEW' }, pid)
              .then((res) => {
                setTimeout(() => {
                  setNotification({
                    type: 'success',
                    message: 'Article status updated',
                  })
                }, 5000)
              })
              .catch((error) => {
                console.error('Failed to send Article to OJS :', error)
                setTimeout(() => {
                  setNotification({
                    type: 'error',
                    message: 'Failed to update Article status',
                    submessage: error.message,
                  })
                }, 5000)
              })
          })
          .catch((error) => {
            console.error('Failed to send Article to OJS :', error)
            setNotification({
              type: 'error',
              message: 'Failed to send Article to OJS for peer review',
              submessage: error.details,
            })
          })
          .finally(() => setLoadingRow(''))
        break
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

  switch (status) {
    case 'SUBMITTED':
      actions.push(modalAction('Accepted'))
      actions.push(modalAction('Declined'))
      actions.push(modalAction('Abandoned'))
      break
    case 'ACCEPTED':
      actions.push(modalAction('Declined'))
      actions.push(modalAction('Abandoned'))
      break
    case 'TECHNICAL_REVIEW':
      if (isArticle) {
        actions.push(defaultAction('Ojs', 'Send to OJS'))
      }
      break
    case 'PUBLISHED':
      if (isArticle) {
        actions.push(modalAction('Bluesky'))
        actions.push(modalAction('Facebook'))
      }
      break
    default:
      break
  }

  return actions
}

export { getRowActions }
