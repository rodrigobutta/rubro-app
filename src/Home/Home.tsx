import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,  
  SafeAreaView
} from "react-native";
import { connect} from 'react-redux';


import CommonStyles from "../utils/CommonStyles";

import MainMenuBurguer from "../utils/MainMenuBurguer";
// import { navigationOptionsHeader } from '../utils/router';


class Home extends React.Component<any, any>{    
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Dashboard',
      headerLeft: (
        <MainMenuBurguer navigation={navigation} badge={1}  />                
      )      
    };
  };



  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // const { currentUser } = firebase.auth();
    // this.setState({ currentUser });
    // console.log("Home Screen");
    // console.log("====================================");
    // console.log(currentUser);
    // console.log("====================================");
  }

  // _loginType = () => {
  //   const { currentUser } = firebase.auth();
  //   if (currentUser.isAnonymous) {
  //     return "Anonymous";
  //   }
  //   var loginType = "";
  //   switch (currentUser.providerData[0].providerId) {
  //     case firebase.auth.EmailAuthProvider.PROVIDER_ID:
  //       loginType = "Email";
  //       break;
  //     case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
  //       loginType = "Phone";
  //       break;
  //     case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
  //       loginType = "Facebook";
  //       break;
  //     case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
  //       loginType = "Google";
  //       break;
  //   }
  //   return loginType;
  // };


  render() {
    // const { currentUser } = firebase.auth();
    const { user } = this.props.auth;

    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

          <Image
            source={require("../../assets/app_logo.png")}
            style={{ height: 100, width: 100, marginBottom: 10 }}
          />

          {user&&
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Hola {user.name}!
          </Text>
          }

        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
export default connect(mapStateToProps)(Home);


const styles = StyleSheet.create({
  normalText: {
    fontSize: 15,
    marginBottom: 5
  }
});



