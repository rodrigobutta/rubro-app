import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,  
  SafeAreaView
} from "react-native";

import CommonStyles from "../utils/CommonStyles";
import firebase from "react-native-firebase";
import { LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";


  

// export default class Home extends Component {

export default class Home extends React.Component{  
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
            Logueado!
          </Text>

          {currentUser&&
            <React.Fragment>
              <Image source={{ uri: currentUser.photoURL }} style={{ width: 50, height: 50, marginTop:10 }} />            
              <Text style={styles.normalText}>Name: {currentUser.displayName}</Text>
              <Text style={styles.normalText}>Email: {currentUser.email}</Text>
              <Text style={styles.normalText}>Login Type : {this._loginType()}</Text>
            </React.Fragment>            
          }
          

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



