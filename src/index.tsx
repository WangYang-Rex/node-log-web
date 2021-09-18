import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, withRouter } from 'react-router-dom';
import Routers from 'src/router' //'./router';
import '@/styles/index.less';
import '@/styles/app.less';
import reportWebVitals from './reportWebVitals';
import LeftNav from 'src/components/leftnav/Leftnav' //'src/components/leftnav/Leftnav';
import NewHeader from './components/newheader/Newheader';
/**
 * 主体
 */
 const App = withRouter(function App(props: any) {
  // eslint-disable-next-line no-restricted-globals
  const { href, hash } = location;
  const filterRouter = ['login'];
  const includesRouter = filterRouter.filter(v => {
    return href.includes(v);
  });

  let appContent = null;

  if (includesRouter.length) {
    appContent = (
      <div className="pageMain t-FBH">
        <Routers />
      </div>
    );
  } else {
    appContent = (
      <div className="pageMain-wrap t-FBV">
        {/* <TopHead /> */}
        <NewHeader />
        <div className="pageMain t-FBH" style={{ top: '56px' }}>
          <LeftNav {...props} />
          <div className="main-content t-FB1 t-FBV">
            <Routers />
          </div>
        </div>
      </div>
    );
  }

  return appContent
});

ReactDOM.render(
  <HashRouter>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
