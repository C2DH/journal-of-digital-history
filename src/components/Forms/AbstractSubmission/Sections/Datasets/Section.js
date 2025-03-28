import React from 'react'
import { useTranslation } from 'react-i18next'
import FormAbstractGenericSortableList from '../../GenericSortableList'
import FormGroupWrapperPreview from '../../GroupWrapperPreview'
import Dataset from '../../../../../models/Dataset'

const DatasetsSection = ({ temporaryAbstractSubmission, handleChange, isPreviewMode }) => {
  const { t } = useTranslation()

  return (
    <>
      <h3 className="progressiveHeading">{t('pages.abstractSubmission.DataSectionTitle')}</h3>
      {!isPreviewMode && (
        <FormAbstractGenericSortableList
          onChange={({ items, isValid }) => handleChange({
              id: 'datasets',
              value: items,
              isValid,
            })
          }
          initialItems={temporaryAbstractSubmission.datasets}
          ItemClass={Dataset}
          addNewItemLabel={t('actions.addDataset')}
          listItemComponentTagName="FormAbstractDatasetsListItem"
        />
      )}
      {isPreviewMode &&
        temporaryAbstractSubmission.datasets.map((d, i) => (
          <FormGroupWrapperPreview key={i}>
            {new Dataset({ ...d }).asText()}
          </FormGroupWrapperPreview>
        ))}
      <hr />
    </>
  )
}

export default DatasetsSection
