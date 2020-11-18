import React from 'react'

const FormJSONSchemaErrorListItem = ({ error }) => {
  const {property, message, name } = error
  
  return (
    <div>
      {property} : {message} ({name})
    </div>
  )
}

export default FormJSONSchemaErrorListItem