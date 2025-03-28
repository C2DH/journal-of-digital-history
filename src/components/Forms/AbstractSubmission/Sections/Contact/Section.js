import React from 'react'
import { useTranslation } from 'react-i18next'
import FormGroupWrapperPreview from '../../GroupWrapperPreview'
import FormAuthorContact from './Form'
import { default as Author } from '../../../../../models/Author'

const ContactPointSection = ({ 
  temporaryAbstractSubmission, 
  handleChange, 
  handleAddContactAsAuthor, 
  isPreviewMode 
}) => {
  const { t } = useTranslation()

  return (
    <>
     <h3 className='progressiveHeading'>
        {t('pages.abstractSubmission.ContactPointSectionTitle')}
      </h3>
      {!isPreviewMode && (
        <FormAuthorContact
          initialValue={temporaryAbstractSubmission.contact}
          onChange={({ value, isValid }) =>
            handleChange({ id: 'contact', value, isValid })
          }
          onSelectAsAuthor={handleAddContactAsAuthor}
        />
      )}
      {isPreviewMode && (
        <FormGroupWrapperPreview>
          {new Author({
            ...temporaryAbstractSubmission.contact,
          }).asText()}
        </FormGroupWrapperPreview>
      )}
      <hr />
    </>
  )
}

export default ContactPointSection