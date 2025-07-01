import axios from 'axios'

const modifyAbstractStatus = async (pid, body) => {
  console.info('[modifyAbstractStatus] -  postData.ts')
  return axios
    .put(`dashboard/contact-form/${pid}`, body)
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log('hello')
      console.log(res)
      return res
    })
}

export { modifyAbstractStatus }
