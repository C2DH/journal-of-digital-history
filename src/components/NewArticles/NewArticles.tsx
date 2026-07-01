import './NewArticles.css'

import NewArticle from './NewArticle'

const NewArticles = ({ width, articles }) => {
  return (
    <div className="homereel-newArticles" style={{ width, height: '180px' }}>
      {' '}
      {articles.map((article) => (
        <NewArticle key={article.abstract?.pid} article={article} />
      ))}
    </div>
  )
}

export default NewArticles
