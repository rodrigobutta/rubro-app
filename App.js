import React, { Component } from "react";
import { View, StatusBar, AsyncStorage, Text } from "react-native";

import firebase from "react-native-firebase";
import Constants from "./src/utils/Constants";
import * as Utilities from "./src/utils/Utilities";
import LoginRouter from "./src/utils/LoginRouter";
import Home from "./src/Home/Home";
import { GoogleSignin } from 'react-native-google-signin';



import {
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';


import {Provider, connect} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
// import { withRkTheme } from 'react-native-ui-kitten';

// import { AppRoutes } from './src/config/navigation/routesBuilder';
// import * as Screens from './src/screens';
// import { bootstrap } from './src/config/bootstrap';
// import track from './config/analytics';
import { data } from './src/data';
import {store, persistor} from './src/redux/store';
import CounterViewContainer from './src/modules/counter/CounterViewContainer';
import ColorViewContainer from './src/modules/colors/ColorViewContainer';
import Agenda from './src/modules/agenda/agenda';
import LoginViewContainer from './src/modules/auth/LoginViewContainer';


import axios from 'axios';
import { API_URL } from './src/config/enviroment';


import {setToken, setUser} from './src/modules/auth/AuthState';


// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
XMLHttpRequest = GLOBAL.originalXMLHttpRequest;  // con este salta error rojo a cada vez, pero veo en NETWORK XHR
// XMLHttpRequest = GLOBAL.XMLHttpRequest  // con este no tengo error pero lo veo en FETCH del CONSOLE

// bootstrap();
data.populateData();



const MainnnApp = createStackNavigator({
  First: {
    screen: LoginViewContainer// Screens.SplashScreen,
  },
  // Home: {
  //   screen: createDrawerNavigator(
  //     {
  //       ...AppRoutes,
  //     },
  //     {
  //       contentComponent: (props) => {
  //         const SideMenu = withRkTheme(Screens.SideMenu);
  //         return <SideMenu {...props} />;
  //       },
  //     },
  //   ),
  // },
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
}, {
  headerMode: 'none',
});


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


  // class App extends Component {
export default class App extends Component {
  
  constructor(props) {
    super(props);

    // States
    this.state = {
      isLogin: null,
      isLoaded: false
    };

    // Set Statusbar Light Content for iOS
    StatusBar.setBarStyle("light-content", true);

    // Global Variables (App wise scope)
    Utilities.setInitialGlobalValues();
  }


  _coreAuth = (user) => {

        
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
        
        // this.props.authStateActions.setToken(response.data.access_token, response.data.expires_at);
        store.dispatch(setToken(response.data.access_token, response.data.expires_at));
        
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

        if (global.fullNameTemp) {
          // *** parece que fuera solo si viene del registro sign up manual

          user
          .updateProfile({
            displayName: global.fullNameTemp
          })
          .then(() => {
            // console.log(user);

            global.fullNameTemp = null;
            
            this.setState({ isLogin: true });
            this._coreAuth(user);

          });

        } else {
          // console.log(user);

          this.setState({ isLogin: true });
          this._coreAuth(user);

        }

      } else {

        // AsyncStorage.removeItem(Constants.keyCurrentUser);
        this.setState({ isLogin: false });

      }


  });




  setTimeout(() => {
    if (global.currentUser === null) {
      this.setState({
        isLogin: false,
        isLoaded: true
      });      
    } else {
      this.setState({
        isLogin: true,          
        isLoaded: true
      });
    }
  }, 500); // Time to display Splash Screen


  }



  
  onNavigationStateChange = (previous, current) => {
    const screen = {
      current: this.getCurrentRouteName(current),
      previous: this.getCurrentRouteName(previous),
    };
    // if (screen.previous !== screen.current) {
    //   track(screen.current);
    // }
  };

  getCurrentRouteName = (navigation) => {
    const route = navigation.routes[navigation.index];
    return route.routes ? this.getCurrentRouteName(route) : route.routeName;
  };

  loadAssets = async () => {
    // await Font.loadAsync({
    //   fontawesome: require('./assets/fonts/fontawesome.ttf'),
    //   icomoon: require('./assets/fonts/icomoon.ttf'),
    //   'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
    //   'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    //   'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    //   'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    //   'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    // });
    // this.setState({ isLoaded: true });
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

          {this.state.isLogin ? <Home /> : <LoginRouter />}
    
        
        
        </View>
      </PersistGate>
    </Provider>
  );

  render = () => (this.state.isLoaded ? this.renderApp() : this.renderLoading());

 
}

