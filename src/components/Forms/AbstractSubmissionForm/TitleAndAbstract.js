import React from 'react'
import { useTranslation } from 'react-i18next'
import FormGroupWrapper from '../FormGroupWrapper'
import FormGroupWrapperPreview from '../FormGroupWrapperPreview'

const TitleAndAbstractSection = ({ temporaryAbstractSubmission, handleChange, isPreviewMode }) => {
  const { t } = useTranslation()

  //TODO Needs to check if Title works correctly
  return (
    <>
      <h3 className="progressiveHeading">
        {t('pages.abstractSubmission.TitleAndAbstractSectionTitle')}
      </h3>
      {/* {!isPreviewMode && (
        <FormGroupWrapper
          as="textarea"
          schemaId="#/definitions/title"
          rows={3}
          initialValue={temporaryAbstractSubmission.title}
          label="pages.abstractSubmission.articleTitle"
          ignoreWhenLengthIslessThan={1}
          onChange={handleChange}
        />
      )}
      {isPreviewMode && (
        <FormGroupWrapperPreview label="pages.abstractSubmission.articleTitle">
          {temporaryAbstractSubmission.title}
        </FormGroupWrapperPreview>
      )} */}
      {!isPreviewMode && (
        <FormGroupWrapper
          as="textarea"
          schemaId="#/definitions/abstract"
          rows={5}
          placeholder={t('pages.abstractSubmission.articleAbstractPlaceholder')}
          initialValue={temporaryAbstractSubmission.abstract}
          label="pages.abstractSubmission.articleAbstract"
          ignoreWhenLengthIslessThan={1}
          onChange={({ value, isValid }) => handleChange({ id: 'abstract', value, isValid })}
        />
      )}
      {isPreviewMode && (
        <FormGroupWrapperPreview label="pages.abstractSubmission.articleAbstract">
          {temporaryAbstractSubmission.abstract}
        </FormGroupWrapperPreview>
      )}
      <hr />
    </>
  )
}

export default TitleAndAbstractSection
