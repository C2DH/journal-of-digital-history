import React from 'react'

import { Layers, LayersLabel } from '../../constants/globalConstants'

import '../../styles/components/ArticleV3/ArticleLayers.scss'

const ArticleLayers = () => (
  <div className="ArticleLayers">
    {Layers.map((layer, i) => (
      <div className={`layer ${layer}`} key={i}>
        <div className="label">{LayersLabel[i]}</div>
      </div>
    ))}
  </div>
)

export default ArticleLayers
