import React from 'react';

const ArticleAuthor = ({ author }) => {
  return (
    <><b>{author.lastname}</b> {author.firstname} ({author.affiliation})</>
  )
}

export default ArticleAuthor
