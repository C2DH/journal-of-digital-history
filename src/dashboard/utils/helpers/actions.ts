import { ModalInfo, RowAction } from '../types'

/**
 * Generates a list of row actions based on the current status of the row.
 *
 * @param row - The data row from which to determine available actions.
 * @param setModal - Function to open a modal dialog with action details.
 * @param t - Translation function for localizing action labels.
 * @returns An array of RowAction objects representing available actions for the row.
 */
function getRowActions(
  isArticle: boolean,
  row: any,
  setModal: (modal: ModalInfo) => void,
  t: (key: string) => string,
): RowAction[] {
  let status: string
  if (isArticle === true) {
    status = row[5]
  } else {
    status = row[6]
  }
  const id = row[0]
  const title = row[1]
  const actions: RowAction[] = []

  const defaultAction = (action: string, label?: string) => ({
    label: label || action,
    onClick: () =>
      setModal &&
      setModal({
        open: true,
        action,
        row,
        id,
        title,
      }),
  })

  if (status === 'SUBMITTED') {
    actions.push(defaultAction('Accepted'))
    actions.push(defaultAction('Declined'))
    actions.push(defaultAction('Abandoned'))
  }

  if (status === 'ACCEPTED') {
    actions.push(defaultAction('Abandoned'))
    actions.push(defaultAction('Suspended'))
  }

  if (isArticle && status === 'PUBLISHED') {
    actions.push(defaultAction('Bluesky'))
    actions.push(defaultAction('Facebook'))
  }

  return actions
}

export { getRowActions }
