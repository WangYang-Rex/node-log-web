import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { importPath } from './loadable';
let router = [
  {
    path: '/',
    exact: true,
    component:importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/file/list"),
    }),
  },
  {
    path: '/demo',
    exact: true,
    component:importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/demo/App"),
    }),
  },
  {
    path: '/jserror/list',
    exact: true,
    component:importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/jserror/list"),
    }),
  },
  {
    path: '/slink/list',
    exact: true,
    component:importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/slink/list"),
    }),
  },
  {
    path: '/file/list',
    exact: true,
    component:importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/file/list"),
    }),
  },
  {
    path: '/threejs',
    exact: true,
    component: importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/threejs/threejs"),
    }),
  },
  {
    path: '/rank',
    exact: true,
    component: importPath({
      loader: () => import(/* webpackChunkName:"home" */ "src/pages/githubrank/list"),
    }),
  },
  
  // {
  //   path: '/login',
  //   exact: true,
  //   component:Login,
  // },
  // {
  //   path: '/home',
  //   exact: true,
  //   component:importPath({
  //     loader: () => import(/* webpackChunkName:"home" */ "pages/newhome/home/home.tsx"),
  //   }),
  // },
]
const Routers = () => (
  // <main>
    <Switch>
      {
        [...router].map(({component,path,exact},index)=>{
          return <Route exact={exact} path={path} component={component} key={path} />
        })
      }
    </Switch>
  // </main>
);

export default Routers;
