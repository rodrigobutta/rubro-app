import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';

import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialIcons';


import { API_URL } from '../../config/enviroment';

// import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
// import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
// import * as AppAuth from 'expo-app-auth';


const color = () => Math.floor(255 * Math.random());

class LoginView extends Component {
  static displayName = 'LoginView';

  static navigationOptions = {
    title: 'Login',
    tabBarIcon: (props) => (
        <Icon name='color-lens' size={24} color={props.tintColor} />
      ),
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#39babd'
    }
  }

  static propTypes = {
    navigate: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      background: `rgba(${color()},${color()},${color()}, 1)`
    };
  }


  login = () => {
    console.log('Login');

    var data = {};
        data.email = 'user1@gmail.com';
        data.password = 'pass1';        
        data.remember_me = true;        
    
    axios
    .post(API_URL + '/auth/login', data)
    .then(response => {
      // console.log(response);
      this.props.authStateActions.setToken(response.data.access_token, response.data.expires_at);
      return true;
    })
    .catch(error => console.log(error));

  }


  logout = () => {
    console.log('Logout');

    axios
    .get(API_URL + '/auth/logout')
    .then(res => {
      // console.log(res);
      this.props.authStateActions.resetToken();
      return true;
    })
    .catch(err => console.log(err));

  }

  info = () => {
    console.log('Info');

    axios
    .get(API_URL + '/auth/user')
    .then(response => {
      console.log(response);
      this.props.authStateActions.setUserInfo(response.data);
      return true;
    })
    .catch(err => console.log(err));

  }
  
  test = () => {
    console.log('test');
 
    // LoginManager.logInWithReadPermissions(["public_profile"]).then(
    //   function(result) {
    //     if (result.isCancelled) {
    //       console.log("Login cancelled");
    //     } else {
    //       console.log(
    //         "Login success with permissions: " +
    //           result.grantedPermissions.toString()
    //       );
    //     }
    //   },
    //   function(error) {
    //     console.log("Login fail with error: " + error);
    //   }
    // );


    (async () => {
      await this.signInAsync();
    })();

    // const tokenResponse = await AppAuth.authAsync(config);

    // console.log(tokenResponse);
    // console.log('test end');


  }

  
  async signInAsync() {

    // const config = {
    //   issuer: 'https://accounts.google.com',
    //   clientId: '447873658613-o536v5f5c4c1l0o12tctgpkok0fsph01.apps.googleusercontent.com',
    //   scopes: ['profile'],
    // };
    


    // const authState = await AppAuth.authAsync(config);
    // await cacheAuthAsync(authState);
    // console.log('signInAsync', authState);
  
    // return authState;
  
  }

  


render() {
    const buttonText = 'Login';
    return (
      <View style={[styles.container, {backgroundColor: this.state.background}]}>
        <Button color='#ee7f06' title={buttonText} onPress={this.login}/>
        <Button color='#ee7f06' title='Logout' onPress={this.logout}/>
        <Button color='#ee7f06' title='Tus Datos' onPress={this.info}/>


        <Button color='#ee7f06' title='TEST' onPress={this.test}/>

{/* 
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
          disabled={this.state.isSigninInProgress} /> */}


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LoginView;
