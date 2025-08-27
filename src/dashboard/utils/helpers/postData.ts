import { ContactFormData } from '../../components/ContactForm/interface'
import api from './setApiHeaders'

const modifyAbstractStatusWithEmail = async (pid: string, body: ContactFormData) => {
  console.info('[modifyAbstractStatus] -  postData.ts')

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

const modifyAbstractsStatus = async (body: { pids: string[]; status: string }) => {
  console.info('[modifyAbstractsStatus] -  postData.ts')

  return api
    .patch(`/api/abstracts/status`, body)
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

export { modifyAbstractsStatus, modifyAbstractStatusWithEmail }
