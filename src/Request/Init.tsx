import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,  
  SafeAreaView,
  Button
} from "react-native";

import CommonStyles from "../utils/CommonStyles";

import MainMenuBurguer from "../utils/MainMenuBurguer";

export default class Init extends React.Component<any, any>{     
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Solicitiar',
      headerLeft: (
        <MainMenuBurguer navigation={navigation} badge={1}  />        
      ),
    };
  };

  componentDidMount() {
   
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >

          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Solicitar servicio
          </Text>

          <Button onPress={() => navigation.navigate('RequestMedia')} title="Iniciar" />        
            
        </View>
      </SafeAreaView>
    );
  }
}
