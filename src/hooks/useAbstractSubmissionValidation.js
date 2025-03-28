import { getValidatorResultWithAbstractSchema } from '../logic/validation'

const useAbstractSubmissionValidation = (temporaryAbstractSubmission) => {

  const result = getValidatorResultWithAbstractSchema({
      temporaryAbstractSubmission
    })

  return result
}

export default useAbstractSubmissionValidation