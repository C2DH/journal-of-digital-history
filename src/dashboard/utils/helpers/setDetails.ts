import { convertDate } from '../helpers/convertDate'
import { Abstract, Article } from '../types'
import { isTypeAbstract, isTypeArticle } from './checkItem'

/**
 * Extracts and formats data from an Abstract or Article item to display in the Detail view.
 */
export function setDetails(item: Abstract | Article) {
  let infoFields: { label: string; value: React.ReactNode }[] = []
  let contactFields: { label: string; value: React.ReactNode }[] = []
  let datasetFields: { label: string; value: React.ReactNode; description: string }[] = []
  let urlFields: { value: React.ReactNode }[] = []
  let url = ''
  let title = ''
  let abstractText = ''

  const adminHost =
    window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host
  const adminUrl = (id: string) =>
    `${window.location.protocol}//${adminHost}/admin/jdhapi/article/${id}/change/`

  if (isTypeAbstract(item)) {
    infoFields = [
      { label: 'PID', value: item.pid },
      {
        label: 'Call for papers',
        value: item.callpaper_title === null ? 'Open Submission' : item.callpaper_title,
      },
      { label: 'Status', value: String(item.status) },
      { label: 'Terms accepted', value: item.consented ? 'Yes' : 'No' },
      { label: 'Submission date', value: convertDate(item.submitted_date) },
      {
        label: 'Validation date',
        value: item.validation_date ? convertDate(item.validation_date) : '-',
      },
    ]
    contactFields = [
      { label: 'Contact name', value: `${item.contact_firstname} ${item.contact_lastname}` },
      { label: 'Affiliation', value: `${item.contact_affiliation}` },
      { label: 'Email', value: item.contact_email || '-' },
    ]
    urlFields = [{ value: item.repository_url }]
    datasetFields = [
      ...(item.datasets || []).map((dataset: any) => ({
        label: 'dataset',
        value: dataset.url || null,
        description: dataset.description || '',
      })),
    ]
    url = item.repository_url === undefined ? '-' : item.repository_url
    title = item.title
    abstractText = item.abstract
  } else if (isTypeArticle(item)) {
    infoFields = [
      { label: 'PID', value: item.abstract.pid },
      { label: 'Call for papers', value: item.issue.name || 'Open Submission' },
      { label: 'Status', value: String(item.status) },
      { label: 'Terms accepted', value: item.abstract.consented ? 'Yes' : 'No' },
      { label: 'Submission date', value: convertDate(item.abstract.submitted_date) },
      { label: 'Validation date', value: convertDate(item.abstract.validation_date) },
      { label: 'DOI', value: item.doi || '-' },
    ]
    contactFields = [
      {
        label: 'Contact name',
        value: `${item.abstract.contact_firstname} ${item.abstract.contact_lastname}`,
      },
      { label: 'Affiliation', value: `${item.abstract.contact_affiliation}` },
      {
        label: 'Email',
        value: item.abstract.contact_email || '-',
      },
    ]
    urlFields = [
      { value: item.repository_url },
      { value: item.binder_url },
      {
        value: `https://journalofdigitalhistory.org/en/notebook-viewer/${item.notebook_url}/?v=3`,
      },
      {
        value: adminUrl(item.abstract.id.toString()),
      },
    ]
    datasetFields = [
      ...(item.abstract.datasets || []).map((dataset: any) => ({
        label: 'dataset',
        value: dataset.url || null,
        description: dataset.description || '',
      })),
    ]
    url = item.repository_url
    title =
      Array.isArray(item.data?.title) && item.data?.title.length > 0
        ? item.data.title[0]
        : item.abstract.title
    abstractText =
      Array.isArray(item.data?.abstract) && item.data?.abstract.length > 0
        ? item.data.abstract[0]
        : item.abstract.abstract
  }

  return { infoFields, contactFields, datasetFields, urlFields, url, title, abstractText }
}
