import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import CommonStyles from "../Utils/CommonStyles";
import firebase from "react-native-firebase";
import { LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    console.log("Home Screen");
    console.log("====================================");
    console.log(currentUser);
    console.log("====================================");
  }

  _logout = async () => {
    await LoginManager.logOut();
    await GoogleSignin.signOut();
    firebase
      .auth()
      .signOut()
      .then();
  };

  _loginType = () => {
    const { currentUser } = firebase.auth();

    if (currentUser.isAnonymous) {
      return "Anonymous";
    }

    var loginType = "";
    switch (currentUser.providerData[0].providerId) {
      case firebase.auth.EmailAuthProvider.PROVIDER_ID:
        loginType = "Email";
        break;
      case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
        loginType = "Phone";
        break;
      case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        loginType = "Facebook";
        break;
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        loginType = "Google";
        break;
    }

    return loginType;
  };

  _renderUserId = () => {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return null;
    }

    return currentUser.uid ? (
      <Text style={styles.normalText}>User Id: {currentUser.uid}</Text>
    ) : null;
  };


  _renderUserToken = () => {
    const { currentUser } = firebase.auth();
    
    console.log('tokennnnn')

    console.log(currentUser)


    currentUser.getIdToken().then(function(idToken) {  // <------ Check this line
      // alert(idToken); // It shows the Firebase token now

      console.log(idToken)

      return idToken;
  });

    
    
    return <Text style={styles.normalText}>Token: ****</Text>
  };

  _renderDisplayName = () => {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return null;
    }

    return currentUser.displayName ? (
      <Text style={styles.normalText}>
        Display Name: {currentUser.displayName}
      </Text>
    ) : null;
  };

  _renderEmail = () => {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return null;
    }

    return currentUser.email ? (
      <Text style={styles.normalText}>Email: {currentUser.email}</Text>
    ) : null;
  };

  _renderLoginType = () => {
    return (
      <Text style={styles.normalText}>Login Type : {this._loginType()}</Text>
    );
  };

  _renderUserImage = () => {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return null;
    }

    return currentUser.photoURL ? (
      <Image
        source={{ uri: currentUser.photoURL }}
        style={{ width: 50, height: 50, marginTop:10 }}
      />
    ) : null;
  };

  render() {
    const { currentUser } = firebase.auth();

    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../../assets/firebase_logo.png")}
            style={{ height: 100, width: 100, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Logged in successfully!
          </Text>
          {this._renderUserId()}
          {this._renderDisplayName()}
          {this._renderLoginType()}
          {this._renderEmail()}
          {this._renderUserImage()}
          {this._renderUserToken()}

          <TouchableOpacity
            style={[CommonStyles.themeButton, { marginTop: 20 }]}
            onPress={this._logout}
          >
            <Text style={CommonStyles.themeButtonTitle}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  normalText: {
    fontSize: 15,
    marginBottom: 5
  }
});
