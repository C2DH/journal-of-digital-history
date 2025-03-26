import { useEffect, useState } from 'react'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'

const useAbstractSubmissionValidation = (temporaryAbstractSubmission) => {
  const [validatorResult, setValidatorResult] = useState(temporaryAbstractSubmission)

  useEffect(() => {
    const {
      title,
      abstract,
      contact,
      authors,
      datasets,
      acceptConditions,
      callForPapers,
    } = temporaryAbstractSubmission

    setValidatorResult(
      getValidatorResultWithAbstractSchema({
        title,
        abstract,
        contact,
        authors,
        datasets,
        acceptConditions,
        callForPapers,
      }),
    )
  }, [temporaryAbstractSubmission])

  return validatorResult
}

export default useAbstractSubmissionValidation