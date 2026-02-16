import axios from 'axios'

const createAbstractSubmission = async ({ item, altcha, ...rest }) => {
  console.info('createAbstractSubmission', item, rest)
  return axios
    .post('/api/abstracts/submit', { ...item, altcha })
    .catch((err) => {
      console.error(err)
      throw err
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

export { createAbstractSubmission }
