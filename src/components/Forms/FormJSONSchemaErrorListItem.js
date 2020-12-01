import React from 'react'
import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


const FormJSONSchemaErrorListItem = ({ error, debug, variant="warning" }) => {
  const { t } = useTranslation()
  const {property, message, name } = error
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
      <Badge variant={variant}>{t(`errors.${name}`)}</Badge>
    </h4>
    {!!debug && (<code>{property}: {message} ({name})</code>)}
    </>
  )
}

export default FormJSONSchemaErrorListItem
