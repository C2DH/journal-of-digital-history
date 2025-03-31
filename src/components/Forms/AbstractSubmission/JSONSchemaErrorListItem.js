import React from 'react'

const FormJSONSchemaErrorListItem = ({ error }) => {
  const message = error.message

  return (
    <>
      <h4 className="d-block">
        <span
          dangerouslySetInnerHTML={{
            __html: `${message}`,
          }}
        />
      </h4>
    </>
  )
}

export default FormJSONSchemaErrorListItem
