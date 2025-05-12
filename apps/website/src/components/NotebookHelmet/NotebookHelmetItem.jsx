import React from 'react'

const NotebookHelmetItem = ({
  asName=false,
  property='',
  value='',
  key=''
}) => {
  console.debug('[NotebookHelmetItem] property', property, value)

  if (!value.length) {
    return null
  }
  // e.g; we can have multiple values for "article:tag"
  if (Array.isArray(value)) {
    return (
      <React.Fragment>
      {value.map((v, j) => (
        <NotebookHelmetItem
          key={[property, j].join('-')}
          property={property}
          value={v}
          asName={asName}
        />
      ))}
      </React.Fragment>
    )
  }

  if(asName) {
    return (
      <meta key={key} name={property} content={value} />
    )
  }
  return (
    <meta key={key} property={property} content={value} />
  )
}

export default NotebookHelmetItem
