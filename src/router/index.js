import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes';
import Loading from '../components/Loading/Loading.jsx'

const MineRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        {routes.map(route => {
          if (route.exact) {
            return <Route exact {...route} key={route.path}></Route>
          } else {
            return <Route {...route} key={route.path}></Route>
          }
        })}
      </Router>
    </Suspense>
    
  )
}

export default MineRouter;