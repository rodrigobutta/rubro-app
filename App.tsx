import React, { Component } from "react";
import axios from 'axios';

import { data } from './src/data';
import {store} from './src/redux/store';

// import CounterViewContainer from './src/modules/counter/CounterViewContainer';
// import ColorViewContainer from './src/modules/colors/ColorViewContainer';
import MainApp from './src/MainApp';


// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
XMLHttpRequest = GLOBAL.originalXMLHttpRequest;  // con este salta error rojo a cada vez, pero veo en NETWORK XHR
// XMLHttpRequest = GLOBAL.XMLHttpRequest  // con este no tengo error pero lo veo en FETCH del CONSOLE

// bootstrap();
data.populateData();


axios.interceptors.request.use(function (params) {
  
  const state = store.getState(store);
  let token = state.auth.token; 
  // console.log(token);
  if (token) {
      params.headers['authorization'] = 'Bearer ' + token;
  }

  return params;

}, function (err) {
  return Promise.reject(err);
});

export default class App extends React.Component {
  render() {
    return <MainApp />;
  }
}
