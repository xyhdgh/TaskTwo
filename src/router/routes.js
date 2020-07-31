import React from 'react';

const Home = React.lazy(() => import('../views/Home/Home.jsx'))
const RegisterPage = React.lazy(() => import('../views/Register/RegisterPage.jsx'))
const LoginPage = React.lazy(() => import('../views/Login/LoginPage.jsx'))
const MinePage = React.lazy(() => import('../views/Mine/MinePage.jsx'))
const eventPage = React.lazy(() => import('../views/EventsPage/EventPage.jsx'))

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/register',
    component: RegisterPage
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/mine',
    component: MinePage
  },
  {
    path: '/events/:id',
    component: eventPage
  }
]

export default routes;