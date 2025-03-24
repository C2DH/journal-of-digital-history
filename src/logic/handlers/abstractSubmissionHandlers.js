import { createAbstractSubmission } from '../api/postData'
  
  export const handleAddContactAsAuthor = (author, temporaryAbstractSubmission, setTemporaryAbstractSubmission, results, setResults) => {
    const authors = temporaryAbstractSubmission.authors
      .filter((d) => d.id !== author.id)
      .concat([{ ...author }])
    setTemporaryAbstractSubmission({
      ...temporaryAbstractSubmission,
      authors,
    })
    setResults(
      results.map((d) => {
        if (d.id === 'authors') {
          return {
            ...d,
            value: authors,
          }
        }
        return d
      }),
    )
  }
  
  export const handleSubmit = async (event, results, validatorResult, setTemporaryAbstractSubmission, temporaryAbstractSubmission, recaptchaRef, history, setIsSubmitting) => {
    event.preventDefault()
  
    if (validatorResult?.valid) {
      setIsSubmitting(true)
      const submission = results.reduce((acc, el) => {
        acc[el.id] = el.value
        return acc
      }, {})
      setTemporaryAbstractSubmission(submission)
      const token = await recaptchaRef.current.executeAsync()

      createAbstractSubmission({
        item: temporaryAbstractSubmission,
        token,
      })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            history.push('/en/abstract-submitted')
          }
        })
        .catch((err) => {
          console.info(err.message, 'status=', err.response.status)
          setIsSubmitting(false)
        })
    }
  }