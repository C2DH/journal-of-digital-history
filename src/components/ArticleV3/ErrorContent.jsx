import React from 'react'
import Ansi from '@curvenote/ansi-to-react'

export default function ErrorContent({ errors, idx }) {
  return (
    <div>
      {' '}
      {errors.map((error, j) => (
        <div key={`error-${idx}-${j}`}>
          <div>
            {error.ename} - {error.evalue}
          </div>
          <Ansi useClasses>{error.traceback.join('\n')}</Ansi>
        </div>
      ))}
    </div>
  )
}
