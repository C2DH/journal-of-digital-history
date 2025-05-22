import React from 'react'
import { Loader } from 'react-feather'

const Loading = () => {
  return (
    <div className="Loading position-relative">
      <div className="position-absolute rotating">
      <Loader />
      </div>
    </div>
  )
}
export default Loading
