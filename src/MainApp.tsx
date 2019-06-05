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
import * as AuthStateActions from './modules/auth/AuthState';

import {store, persistor} from './redux/store';

import { API_URL } from './config/enviroment';
import {setToken, setUser, resetToken, resetUser} from './modules/auth/AuthState';


class MainApp extends React.Component {  
  constructor(props) {
    super(props);

    this.state = {
      isLogin: null,
      isLoaded: false
    };

    StatusBar.setBarStyle("light-content", true); // Set Statusbar Light Content for iOS

    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched), 
      // we will update local component state and force component to rerender 
      // with new data.
      console.log('updateddddddd')

      const state = store.getState(store);
      const user = state.auth.user; 

      console.log(user);
      
      if(user){
        this.setState({ isLogin: true });
      }
      else{
        this.setState({ isLogin: false });
      }

      


    });


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

          {this.state.isLogin ? <MainRouter /> : <LoginRouter />}
        
        </View>
      </PersistGate>
    </Provider>
  );

  render = () => (this.state.isLoaded && this.state.isLogin != null ? this.renderApp() : this.renderLoading());


  // render() {
  //   const { isLogin } = this.state;

  //   return (
  //     <Provider store={store}>
  //       <PersistGate loading={null} persistor={persistor}>
  //         <View style={{ flex: 1 }}>

  //           {this.state.isLogin ? <MainRouter /> : <LoginRouter />}

  //         </View>
  //       </PersistGate>
  //     </Provider>
  //   );
  // }


}


export default MainApp;


// const mapStateToProps = state => {
//   return {
//     auth: state.auth
//   };
// };
// export default connect(mapStateToProps)(MainApp);

// export default connect(
//   state => ({
//     auth: state.auth
//   }),
//   dispatch => {
//     return {      
//       authStateActions: bindActionCreators(AuthStateActions, dispatch)
//     };
//   }
// )(MainApp);




// const mapState = state => state.auth
// const mapDispatch = { setToken, setUser, resetToken, resetUser }

// export default connect(
//   mapState,
//   mapDispatch
// )(MainApp)