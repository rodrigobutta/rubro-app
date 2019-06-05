import React, { Component } from "react"
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native"

import Icon from 'react-native-vector-icons/Ionicons'
import MainMenuProfile from './MainMenuProfile'
import MainMenuItem from './MainMenuItem'


const userData = {
  profileUrl: 'https://s-media-cache-ak0.pinimg.com/736x/a3/e3/d6/a3e3d67e30105ca1688565e484370ab8--social-networks-harry-potter.jpg',
  username: 'Roooo',
  email: 'ewatson@gryffindor.io'
}

const menuData = [
    {icon: "ios-home-outline", label:"Dashboard", screen:'Dashboard', key:'menu_dashboard'},
    {icon: "ios-chatboxes-outline", label:"Perfil", screen: 'Profile', key:'menu_profile'},  
  ]
  


class MainMenu extends Component {

    

  render() {
    return (
      <View style={styles.container}>
        <MainMenuProfile profileUrl={userData.profileUrl} username={userData.username} email={userData.email} />
        
        <FlatList
            data={menuData} 
            keyExtractor={(item) => item.key}
            renderItem={ ({item}) => 
                <MainMenuItem navigation={this.props.navigation} screen={item.screen} icon={item.icon} label={item.label}  />
            } 
        />
      
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.43)'
  },
  menuItem: {
    flexDirection:'row'
  },
  menuItemText: {
    fontSize:15,
    fontWeight:'300',
    margin:15,
  }
})

MainMenu.defaultProps = {};

MainMenu.propTypes = {};

export default MainMenu;