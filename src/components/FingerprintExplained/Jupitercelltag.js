import React from 'react'


const Jupitercelltag=({
  tag = "tagname",
  type = "x",
  // children
}) => {
  return (
    <label className="Jupitercelltag">
      {tag} {type}
    </label>
  );
}

export default Jupitercelltag
