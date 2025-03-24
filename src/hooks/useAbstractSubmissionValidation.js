import { useEffect, useState } from 'react'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'

const useAbstractSubmissionValidation = (temporaryAbstractSubmission) => {
  const [result, setResult] = useState({instance: {}, errors: []})
  
  useEffect(() => {
    const validatorResult = getValidatorResultWithAbstractSchema(
      temporaryAbstractSubmission
    )
    setResult(validatorResult) 
  }, [temporaryAbstractSubmission])

  return result
}

export default useAbstractSubmissionValidation