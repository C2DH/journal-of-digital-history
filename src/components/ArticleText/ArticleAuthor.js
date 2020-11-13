import React from 'react'
import {Badge} from 'react-bootstrap'


const ArticleAuthor = ({ author }) => {
  return (
    <>
      <h3>{author.lastname} {author.firstname}</h3>
      <br/>
      {author.affiliation}
      <br/>
      <Badge variant="dark">orcid</Badge> <a href={author.orcid}>
        {author.orcid.replace('https://orcid.org/','')}
      </a>
    </>
  )
}

export default ArticleAuthor
