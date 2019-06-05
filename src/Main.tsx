import React, { Component } from "react";
import { View, StatusBar, AsyncStorage, Text, Platform, Animated, Image } from "react-native";

import firebase from "react-native-firebase";
import { GoogleSignin } from 'react-native-google-signin';
import {Provider, connect} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {bindActionCreators} from 'redux';
import axios from 'axios';

import LoginRouter from "./utils/LoginRouter";
import { MainRouter } from "./utils/router";
// import * as AuthStateActions from './modules/auth/AuthState';


import {store, persistor} from './redux/store';

import { API_URL } from './config/enviroment';
import {setToken, setUser, resetToken, resetUser} from './modules/auth/AuthState';


class Main extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      // isLogin: null,
      isLoaded: false
    };

    StatusBar.setBarStyle("light-content", true); // Set Statusbar Light Content for iOS

  }


  _coreAuth = (user) => {
    console.log('_coreAuth')
        
    // global.currentUser = user;
    // AsyncStorage.setItem(Constants.keyCurrentUser, JSON.stringify(user));

    user.getIdToken().then(function(idToken) {  // <------ Check this line
      console.log("app-js _coreAuth");
      console.log(idToken)

      var data = {};
        data.token = idToken;
        data.uid = user.uid;
        data.email = user.email;
        data.emailVerified = user.emailVerified;
        data.name = user.displayName;
        data.phone = user.phoneNumber;
        data.photourl = user.photoURL;
        data.provider = user.providerData[0].providerId;
    
      axios
      .post(API_URL + '/auth/firebase/login', data)
      .then(response => {
        console.log(response);
                
        store.dispatch(setToken(response.data.access_token, response.data.expires_at));
        store.dispatch(setUser(response.data.user));

        // this.setState({ isLogin: true });
        
        return true;
      })
      .catch(error => console.log(error));

    });

  };


  // Life Cycle
  componentWillMount() {

    this.loadAssets();

    GoogleSignin.configure();

    firebase.auth().onAuthStateChanged(user => {
      console.log('onAuthStateChanged', user)

      if (user) {

        if (global.fullNameTemp) { // *** parece que fuera solo si viene del registro sign up manual
          
          user.updateProfile({
            displayName: global.fullNameTemp
          }).then(() => {
            global.fullNameTemp = null;
            
            // this.setState({ isLogin: true });
            this._coreAuth(user);
          });

        } else {
          // this.setState({ isLogin: true });
          this._coreAuth(user);
        }

      } else {

        // AsyncStorage.removeItem(Constants.keyCurrentUser);
        // this.setState({ isLogin: false });

        store.dispatch(resetToken());
        store.dispatch(resetUser());

      }

    });

    

  }

  loadAssets = async () => {
    // await Font.loadAsync({
    //   fontawesome: require('./assets/fonts/fontawesome.ttf'),
    //   icomoon: require('./assets/fonts/icomoon.ttf'),
    //   'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    // });
    // this.setState({ isLoaded: true });

    setTimeout(() => {

      this.setState({
        isLoaded: true
      });

    }, 500);

  };

  renderLoading = () => (
    <View style={{ flex: 1 }}>
      <Text>{'Cargando...'}</Text>
    </View>
  );

  renderApp = () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>

          {/* {this.props.auth.user ? <MainRouter /> : <LoginRouter />} */}

          <LoginRouter />
          
        
        </View>
      </PersistGate>
    </Provider>
  );

  render = () => (this.state.isLoaded ? this.renderApp() : this.renderLoading());

}


// export default Main;

// export default connect(
//   state => ({
//     auth: state.auth
//   }),
//   dispatch => {
//     return {      
//       authStateActions: bindActionCreators(AuthStateActions, dispatch)
//     };
//   }
// )(Main);




const mapState = state => state.auth
const mapDispatch = { setToken, setUser, resetToken, resetUser }

// call connect to generate the wrapper function, and immediately call
// the wrapper function to generate the final wrapper component.

export default connect(
  mapState,
  mapDispatch
)(Main)