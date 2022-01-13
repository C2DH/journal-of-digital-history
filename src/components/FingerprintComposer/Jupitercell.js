import React from 'react'
import Jupitercelltag from './Jupitercelltag'

const Jupitercell = ({
  isNarative = false,
  isHermeneutics = false,
  isData = false,
  children
  }) => {
  let divClassName = "Jupitercell";
  if (isNarative === true) {
    divClassName = "Jupitercell Narative";
  } else if (isHermeneutics === true) {
    divClassName = "Jupitercell Hermeneutics";
  } else if (isData === true) {
    divClassName = "Jupitercell Data";
  }
  return (
    <div className={divClassName}>
      <p>{children}</p>
      {isNarative === true ? (
        <Jupitercelltag tag="Narrative"></Jupitercelltag>
      ) : null}
      {isHermeneutics ? (
        <Jupitercelltag tag="Hermeneutics"></Jupitercelltag>
      ) : null}
      {isData ? <Jupitercelltag tag="Data"></Jupitercelltag> : null}
      <p className="m-0">That's a {divClassName} cell</p>
    </div>
  );
}

export default Jupitercell
