import axios from 'axios'

const createAbstractSubmission = async ({ item, token, ...rest}) => {
  console.info('createAbstractSubmission', item, rest)
  return axios.post('/api/submit-abstract/', { ...item, token }).catch((err) => {
    console.error(err)
    throw err
  }).then(res => {
    console.log(res)
    return res
  })
}

export { createAbstractSubmission }
