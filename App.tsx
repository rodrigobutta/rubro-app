import React, { Component } from "react";
import { View, StatusBar, AsyncStorage, Text, Platform, Animated, Image } from "react-native";

import firebase from "react-native-firebase";
import Constants from "./src/utils/Constants";
import * as Utilities from "./src/utils/Utilities";
import LoginRouter from "./src/utils/LoginRouter";
import { MainRouter } from "./src/utils/router";
// import Home from "./src/Home/Home";
import { GoogleSignin } from 'react-native-google-signin';




import {Provider, connect} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
// import { withRkTheme } from 'react-native-ui-kitten';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import * as AuthStateActions from './src/modules/auth/AuthState';


// import { AppRoutes } from './src/config/navigation/routesBuilder';
// import * as Screens from './src/screens';
// import { bootstrap } from './src/config/bootstrap';
// import track from './config/analytics';
import { data } from './src/data';
import {store, persistor} from './src/redux/store';

import Main from './src/Main';

import axios from 'axios';
import { API_URL } from './src/config/enviroment';


import {setToken, setUser, resetToken, resetUser} from './src/modules/auth/AuthState';

import CounterViewContainer from './src/modules/counter/CounterViewContainer';
import ColorViewContainer from './src/modules/colors/ColorViewContainer';
import Agenda from './src/modules/agenda/agenda';
import LoginViewContainer from './src/modules/auth/LoginViewContainer';
import Camera from './src/modules/camera/camera';


import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';







// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
XMLHttpRequest = GLOBAL.originalXMLHttpRequest;  // con este salta error rojo a cada vez, pero veo en NETWORK XHR
// XMLHttpRequest = GLOBAL.XMLHttpRequest  // con este no tengo error pero lo veo en FETCH del CONSOLE





  
const ExampleRoutes: any = {
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
    console.log('axios.interceptors.request');


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



const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      ...ExampleRoutes,
      Index: {
        screen: Main,
      },
    },
    {
      headerMode: 'none',
      initialRouteName: 'Index',

      /*
       * Use modal on iOS because the card mode comes from the right,
       * which conflicts with the drawer example gesture
       */
      mode: Platform.OS === 'ios' ? 'modal' : 'card',
    }
  )
);






export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

