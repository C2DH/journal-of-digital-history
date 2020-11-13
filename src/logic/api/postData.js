import axios from 'axios'

const createAbstractSubmission = async ({ item, ...rest}) => {
  console.info('createAbstractSubmission', item, rest)
  return axios.post('/api/abstracts', item).catch((err) => {
    console.error(err)
  }).then(res => {
    console.log(res)
    return res
  })
}

export { createAbstractSubmission }