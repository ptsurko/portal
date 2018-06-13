// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));

console.log(PORTAL_APPS);

Object.entries(PORTAL_APPS)
  .map(([appName, url]) => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.onload = () => {
      window[appName]();
      console.log('loaded')
    };
    script.onerror = e => console.error(`Unable to load app ${appName}: `, e);
    document.head.appendChild(script);
  })

// const  = [
//   'http://localhost:3001/bundle.js'
// ];

// APPS.map(url => {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.async = true;
//   script.src = url;
//   script.onload = () => {
//     window['@ptportal/app-reports']();
//     console.log('loaded')
//   };
//   script.onerror = e => console.log('unable to load app: ', e);
//   document.head.appendChild(script);
// })

// Promise.all(APPS.map(app => import(app).catch(e => console.log('unable to load app: ', e))))
//   .then(() => console.log('all apps loaded.'));
