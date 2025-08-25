import { ContactFormData } from '../../components/ContactForm/interface'
import api from './setApiHeaders'

const modifyAbstractStatus = async (pid: string, body: ContactFormData) => {
  console.info('[modifyAbstractStatus] -  postData.ts')

  // TO DO : CHANGE THE ENDPOINT
  return api
    .patch(`/api/dashboard/contact-form/${pid}`, body)
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

export { modifyAbstractStatus }
