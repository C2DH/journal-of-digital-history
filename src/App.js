import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  // Link,
  Redirect,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next'
import { getStartLang, LANGUAGE_PATH, LANGUAGES } from './logic/language';
import translations from './translations'

import Header from './components/Header'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
const NotFound = () => {
  return (<div>
    <h1>Not found</h1>
    <p>sorry your page was not found</p>
  </div>);
}

const { startLangShort, lang } = getStartLang()
console.info('start language:', lang, startLangShort)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: lang,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

function LangRoutes() {
  const { path } = useRouteMatch()
  console.info('LangRoutes render', path)
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route exact path={`${path}/about`}>
        <About />
      </Route>
      <Route exact path={`${path}/submit`}>
        <AbstractSubmission/>
      </Route>
      <Route path={`${path}*`}>
        <NotFound />
      </Route>
    </Switch>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Redirect from="/" exact to={startLangShort} />
      <Route path={LANGUAGE_PATH}>
        <LangRoutes />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header lang={startLangShort} availableLanguages={LANGUAGES}/>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </main>
    </BrowserRouter>
  )
}


// 
// function Issues() {
//   return (
//     <div>
//       <h1>Issues</h1>
// 
//       <Outlet />
//     </div>
//   );
// }
// 
// function IssueIndex() {
//   return (
//     <ul>
//       {Object.entries(issues).map(([slug, { name, img }]) => (
//         <li key={slug}>
//           <Link to={`/issue/${slug}`}>
//             <h2>{name}</h2>
//             <img src={img} alt={name} />
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }
// 
// 
// function Issue(){
//   const {slug} = useParams();
//   const issue = issues[slug];
//   if (!issue){
//     return <h2>issue not found</h2>
//   }
//   const { name, img} = issue;
//   return (
//     <div>
//       <div>
//         <h2>{name}</h2>
//         <img src={img} alt={name} />
//       </div>
//       <div>
//         <ul>
//         {Object.entries(articles).map(([slug, { name, img }]) => (
//           <li key={slug}>
//              <Link to={`/article/${slug}`}>
//               <h2>{name}</h2>
//               <img src={img} alt={name} />
//             </Link>
//           </li>
//         ))}
//         </ul>
//       </div>
//    </div>
// 
//   );
// }
// 
// 
// function Article(){
//   const {slug} = useParams();
//   const article = articles[slug];
//   if (!article){
//     return <h2>article not found</h2>
//   }
//   const { name, img} = article;
//   return (
//       <div>
//         <h2>{name}</h2>
//         <img src={img} alt={name} />
//       </div>
//   );
// }
// 
// 
// const issues = {
//   "twitter-volume": {
//     name: "the twitter volume",
//     img:
//       "/img/JODI_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
//   },
//   "digital-advances": {
//     name: "digital adv@nces",
//     img:
//       "/img/JODI_digital_advance.png?$SNKRS_COVER_WD$&align=0,1"
//   },
//   "network-analysis": {
//     name: "network analysis",
//     img:
//       "/img/JODI_network_analysis.png?$SNKRS_COVER_WD$&align=0,1"
//   }
// };
// 
// 
// const articles = {
//   "twitter-volume-article-1": {
//     name: "Le Centenaire de la bataille de Verdun sur Twitter",
//     img:
//       "/img/JODI_article_1_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
//   },
//   "twitter-volume-article-2": {
//     name: "The history of the automobile industry is filled with partnerships",
//     img:
//       "/img/JODI_article_2_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
//   },
//   "twitter-volume-article-3": {
//     name: "The protesters need a voice: “When we unite, we win.”",
//     img:
//       "/img/JODI_article_3_twitter_volume.png?$SNKRS_COVER_WD$&align=0,1"
//   }
// };
