import api from './headers'

const modifyAbstractStatusWithEmail = async (pid: string, body: Record<string, any>) => {
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
