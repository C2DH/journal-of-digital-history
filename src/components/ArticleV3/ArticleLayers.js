import React from 'react';

import { LayerNarrative, LayerHermeneutics, LayerData } from '../../constants';

import '../../styles/components/ArticleV3/ArticleLayers.scss';


const ArticleLayers = ({ layers = [LayerNarrative, LayerHermeneutics, LayerData] }) => (

  <div className="ArticleLayers">
    {layers.map((layer, i) => (
      <div className={`layer ${layer}`} key={i}>
        {i + 1}
        <div className="label">{layer}</div>
      </div>
    ))}
  </div>
)

export default ArticleLayers;