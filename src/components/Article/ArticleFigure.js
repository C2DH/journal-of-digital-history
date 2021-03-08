import React from 'react'


const ArticleFigure = ({ figure, children }) => {
  return (
    <figcaption className="ArticleFigure position-relative">
      <div className="ArticleFigure_figcaption_num">
        <div className="mr-2">Fig. {figure.num}</div>
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
