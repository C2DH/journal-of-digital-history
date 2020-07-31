import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
} from "react-router-dom";

export default function App(){
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Issues</Link> 
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Issues />} > 
          <Route path="/" element={<IssueIndex />}/>
          <Route path="/issue/:slug" element={<Issue />} /*slug the placeholder matching any value find*//>
        </Route>
        <Route path="/article/:slug" element={<Article />}/>
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} /* page not found *//>
      </Routes>
    </BrowserRouter>
  );
}


function NotFound(){
  return (<div>
    <h1>Not found</h1>
    <p>sorry your page was not found</p>
  </div>);
}


function Home(){
  return (
    <div>
      <h1>Welcome home</h1>
    </div>
  );
}

function About(){
  return (
    <div>
      <h1>Welcome about</h1>
    </div>
  );
}

function Issues() {
  return (
    <div>
      <h1>Issues</h1>

      <Outlet />
    </div>
  );
}

function IssueIndex() {
  return (
    <ul>
      {Object.entries(issues).map(([slug, { name, img }]) => (
        <li key={slug}>
          <Link to={`/issue/${slug}`}>
            <h2>{name}</h2>
            <img src={img} alt={name} />
          </Link>          
        </li>
      ))}
    </ul>
  );
}


function Issue(){
  const {slug} = useParams();
  const issue = issues[slug];
  if (!issue){
    return <h2>issue not found</h2>
  }
  const { name, img} = issue;
  return (
    <div>
      <div>
        <h2>{name}</h2>
        <img src={img} alt={name} />
      </div>
      <div>
        <ul>
        {Object.entries(articles).map(([slug, { name, img }]) => (
          <li key={slug}>
             <Link to={`/article/${slug}`}> 
              <h2>{name}</h2>
              <img src={img} alt={name} />
            </Link>           
          </li>
        ))}
        </ul>
      </div>
   </div>
   
  );
}


function Article(){
  const {slug} = useParams();
  const article = articles[slug];
  if (!article){
    return <h2>article not found</h2>
  }
  const { name, img} = article;
  return (
      <div>
        <h2>{name}</h2>
        <img src={img} alt={name} />
      </div>
  );
}


const issues = {
  "twitter-volume": {
    name: "the twitter volume",
    img:
      "/img/JODI_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
  },
  "digital-advances": {
    name: "digital adv@nces",
    img:
      "/img/JODI_digital_advance.png?$SNKRS_COVER_WD$&align=0,1"
  },
  "network-analysis": {
    name: "network analysis",
    img:
      "/img/JODI_network_analysis.png?$SNKRS_COVER_WD$&align=0,1"
  }
};


const articles = {
  "twitter-volume-article-1": {
    name: "Le Centenaire de la bataille de Verdun sur Twitter",
    img:
      "/img/JODI_article_1_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
  },
  "twitter-volume-article-2": {
    name: "The history of the automobile industry is filled with partnerships",
    img:
      "/img/JODI_article_2_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
  },
  "twitter-volume-article-3": {
    name: "The protesters need a voice: “When we unite, we win.”",
    img:
      "/img/JODI_article_3_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
  }
};