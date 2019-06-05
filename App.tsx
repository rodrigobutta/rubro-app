import React, { Component } from "react";
import { View, StatusBar, AsyncStorage, Text, Platform, Animated, Image } from "react-native";
import axios from 'axios';

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import { data } from './src/data';
import {store, persistor} from './src/redux/store';

import CounterViewContainer from './src/modules/counter/CounterViewContainer';
import ColorViewContainer from './src/modules/colors/ColorViewContainer';
import Agenda from './src/modules/agenda/agenda';
import LoginViewContainer from './src/modules/auth/LoginViewContainer';
import Camera from './src/modules/camera/camera';
import MainApp from './src/MainApp';


// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
XMLHttpRequest = GLOBAL.originalXMLHttpRequest;  // con este salta error rojo a cada vez, pero veo en NETWORK XHR
// XMLHttpRequest = GLOBAL.XMLHttpRequest  // con este no tengo error pero lo veo en FETCH del CONSOLE


  
const MainRoutes: any = {
  First: {
    screen: LoginViewContainer// Screens.SplashScreen,
  },
  Counter: {
    screen: CounterViewContainer
  },
  Color: {
    screen: ColorViewContainer
  },
  Agenda: {
    screen: Agenda
  },
  Login: {
    screen: LoginViewContainer
  },
  Camera: {
    screen: Camera
  }
};
  

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


// const AppNavigator = createAppContainer(
//   createStackNavigator(
//     {
//       ...MainRoutes,
//       Index: {
//         screen: MainApp,
//       },
//     },
//     {
//       headerMode: 'none',
//       initialRouteName: 'Index',
//       mode: Platform.OS === 'ios' ? 'modal' : 'card', // Use modal on iOS because the card mode comes from the right, which conflicts with the drawer example gesture
//     }
//   )
// );


// export default class App extends React.Component {
//   render() {
//     return <AppNavigator />;
//   }
// }