/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { View, StatusBar, AsyncStorage } from "react-native";

import firebase from "react-native-firebase";
import Constants from "./src/Utils/Constants";
import * as Utilities from "./src/Utils/Utilities";
import LoginRouter from "./src/Utils/LoginRouter";
import Home from "./src/Home/Home";
import { GoogleSignin } from 'react-native-google-signin';

export default class App extends Component {
  constructor(props) {
    super(props);

    // States
    this.state = {
      isLogin: null
    };

    // Set Statusbar Light Content for iOS
    StatusBar.setBarStyle("light-content", true);

    // Global Variables (App wise scope)
    Utilities.setInitialGlobalValues();
  }

  // Life Cycle
  componentWillMount() {
    GoogleSignin.configure();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (global.fullNameTemp) {
          user
            .updateProfile({
              displayName: global.fullNameTemp
            })
            .then(() => {
              // user is verified and logged in
              console.log("App.js ====================================");
              console.log(user);
              console.log("====================================");

              global.fullNameTemp = null;
              global.currentUser = user;
              AsyncStorage.setItem(
                Constants.keyCurrentUser,
                JSON.stringify(user)
              );
              this.setState({ isLogin: true });
            });
        } else {
          // user is verified and logged in
          console.log("App.js ====================================");
          console.log(user);
          console.log("====================================");
          global.currentUser = user;
          AsyncStorage.setItem(Constants.keyCurrentUser, JSON.stringify(user));
          this.setState({ isLogin: true });
        }
      } else {
        AsyncStorage.removeItem(Constants.keyCurrentUser);
        this.setState({ isLogin: false });
      }
    });

    setTimeout(() => {
      if (global.currentUser === null) {
        this.setState({
          isLogin: false,
          isStoreSet: false
        });
      } else if (global.currentStore === null) {
        this.setState({
          isLogin: true,
          isStoreSet: false
        });
      } else {
        this.setState({
          isLogin: true,
          isStoreSet: true
        });
      }
    }, 200); // Time to display Splash Screen
  }

  render() {
    if (this.state.isLogin == null) {
      return <View />;
    } else if (this.state.isLogin) {
      return <Home />;
    } else {
      return <LoginRouter />;
    }
  }
}
