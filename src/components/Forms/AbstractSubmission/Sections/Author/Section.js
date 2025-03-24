import React from 'react'
import { useTranslation } from 'react-i18next'
import FormAbstractGenericSortableList from '../../GenericSortableList'
import FormGroupWrapperPreview from '../../GroupWrapperPreview'
import { default as Author } from '../../../../../models/Author'


const AuthorsSection = ({ temporaryAbstractSubmission, handleChange, isPreviewMode }) => {
  const { t } = useTranslation()
  
  return (
    <>
       <h3 className='progressiveHeading'>
          {t('pages.abstractSubmission.AuthorsSectionTitle')}
        </h3>
        {!isPreviewMode && (
          <FormAbstractGenericSortableList
            onChange={({ items, isValid }) => {
              handleChange({
                id: 'authors',
                value: items,
                isValid,
              })
            }}
            ItemClass={Author}
            initialItems={temporaryAbstractSubmission.authors}
            addNewItemLabel={t('actions.addAuthor')}
            listItemComponentTagName='FormAbstractAuthorsListItem'
          />
        )}
        {isPreviewMode &&
          temporaryAbstractSubmission.authors.map((d, i) => (
            <FormGroupWrapperPreview key={i}>
              {new Author({ ...d }).asText()}
            </FormGroupWrapperPreview>
          ))}
      <hr />
    </>
  )
}

export default AuthorsSection