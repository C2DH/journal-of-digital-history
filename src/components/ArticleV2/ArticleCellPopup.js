import React from 'react'
import {a} from 'react-spring'
import { Link } from 'react-feather'
import '../../styles/components/Article/ArticleCellPopup.scss'


const ArticleCellPopup = ({ style, onClick }) => {
  return (
    <a.div className="ArticleCellPopup rounded shadow-sm d-flex" style={style}>
      <label onClick={(e) => onClick(e, {
        idx: style.cellIdx.get(),
        layer:  style.cellLayer.get(),
      })}>add reading point ...</label>
      <span className="ms-2">
        <Link size={12}/>
      </span>
    </a.div>
  )
}
export default ArticleCellPopup
