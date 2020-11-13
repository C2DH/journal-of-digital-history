import React from 'react'
import {Badge} from 'react-bootstrap'


const ArticleAuthor = ({ author }) => {
  return (
    <>
      <h3>{author.lastname} {author.firstname}</h3>
      <br/>
      {author.affiliation}
      <br/>
      {author.orcid?.length && (
        <p>
          <Badge variant="dark">orcid</Badge>
          <a href={author.orcid}>
            {author.orcid.replace('https://orcid.org/','')}
          </a>
        </p>
      )}
    </>
  )
}

export default ArticleAuthor
