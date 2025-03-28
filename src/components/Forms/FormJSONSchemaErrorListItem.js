import React from 'react'
import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


const FormJSONSchemaErrorListItem = ({ error, debug, displayErrors=[], variant="warning" }) => {
  const { t } = useTranslation()

  const property = error.params.errors[0].params.missingProperty 
  const message = error.message

  const translatableProperty = property.split(/\[\d+\]/).join('').split('.').join('-')
  const idx = property.match(/\[(\d+)\]/)
  
  return (
    <>
    <h4 className="d-block">
      <span dangerouslySetInnerHTML={{
        __html: t(`schemaErrors.${translatableProperty}`)
      }} />
      &nbsp;
      {idx?.length > 0 && t('numbers.itemIdx', {idx: idx[1]})}
      &nbsp;
      {displayErrors.includes(property) && <Badge variant={variant}>{t(`errors.${property}`)}</Badge>}
    </h4>
    {!!debug && (<code>{property}: {message} ({property})</code>)}
    </>
  )
}

export default FormJSONSchemaErrorListItem
