import React from "react";
import { View, StatusBar, Text, Image } from "react-native";
import firebase from "react-native-firebase";
import { GoogleSignin } from 'react-native-google-signin';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios';

import LoginRouter from "./utils/LoginRouter";
import { MainRouter } from "./utils/router";
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

    store.subscribe(() => { // When state will be updated when store changes      
      
      const state = store.getState(store);
      const user = state.auth.user; 

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
            this._coreAuth(user);
          });
        } else {          
          this._coreAuth(user);
        }
      } else {
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

    }, 1000);

  };

  renderLoading = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

      <Image
        source={require("../assets/app_logo.png")}
        style={{ height: 100, width: 100 }}
      />

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

}


export default MainApp;