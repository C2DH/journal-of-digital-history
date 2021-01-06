import React, { useMemo } from 'react'
import { useLocation, useHistory } from 'react-router'
import Article from './Article'
import { useGetNotebookFromURL } from '../logic/api/fetchData'
// url=aHR0cHM6Ly9naXRodWIuY29tL0MyREgvamRoLW5vdGVib29rL2Jsb2IvbWFzdGVyL3BvYy5pcHluYg
// as base64 encoded for url=https://github.com/C2DH/jdh-notebook/blob/master/poc.ipynb


const Notebook = () => {
  const { search } = useLocation()
  const history = useHistory()
  const url = useMemo(() => atob((new URLSearchParams(search)).get('url')), [ search ])
  console.info('Notebook', url, search)
  // check url...
  const { status, item} = useGetNotebookFromURL(url)
  // fetch url if available.
  const handleClick = () => {
    history.push({
      pathname: window.location.pathname,
      search: '?url=',
    })
  }
  return (
    <div>
    {item
      ? <Article ipynb={item}/>
      : <button onClick={handleClick}></button>
    }
  </div>
  )
}

export default Notebook
