import { ContactFormData } from '../../components/ContactForm/interface'
import api from './setApiHeaders'

const modifyAbstractStatusWithEmail = async (pid: string, body: ContactFormData) => {
  console.info('PATCH [modifyAbstractStatusWithEmail]')

  return api
    .patch(`/api/abstracts/${pid}/status`, body)
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

const modifyStatus = async (body: { pids: string[]; status: string }, item: string) => {
  console.info(`PATCH [modifyStatus] - ${item} `)

  return api
    .patch(`/api/${item}/status`, body)
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

export { modifyAbstractStatusWithEmail, modifyStatus }
