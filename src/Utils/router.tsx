import React from "react";
import {  
  Text,  
  ScrollView, 
  StatusBar
} from "react-native";

import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  SafeAreaView,
} from 'react-navigation';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../commonComponents/ButtonWithMargin';

import Home from "../Home/Home";
import Profile from "../Profile/Profile";
import EditProfile from "../Profile/Edit";

import MainMenuContents from "./MainMenu";


const SubScreenWrapper = ({
  navigation,
  banner,
}: {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
}) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>      
      <Button onPress={() => navigation.openDrawer()} title="Menú" />
      <Button onPress={() => navigation.navigate('Dashboard2')} title="Directo Dashboard 2" />
      <Button onPress={() => navigation.navigate('Index')} title="Volver" />


    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const ProfileScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <Profile navigation={navigation} /> ;


// (
//   <ScrollView>
//     <SafeAreaView forceInset={{ top: 'always' }}>      
//       <Text>info sobre el perfil del usuario</Text>        
//       <Button onPress={() => navigation.navigate('Profile2')} title="Ir a Profile 2" />        
//     </SafeAreaView>
//     <StatusBar barStyle="default" />
//   </ScrollView>


// ProfileScreen.navigationOptions = {
//   headerTitle: 'Perfil',
// };

// const Profile2Screen = ({
//   navigation,
// }: {
//   navigation: NavigationScreenProp<NavigationState>;
// }) => (
//   <ScrollView>
//     <SafeAreaView forceInset={{ top: 'always' }}>      
//       <Text>perfil 2222 info sobre el perfil del usuario</Text>        
//       <Button onPress={() => navigation.navigate('Profile')} title="Volver" />        
//     </SafeAreaView>
//     <StatusBar barStyle="default" />
//   </ScrollView>
// );



const DashboardScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <ScrollView>
      <SafeAreaView forceInset={{ top: 'always' }}>      
        <Home navigation={navigation} />
        <Button onPress={() => navigation.openDrawer()} title="Menú" />
        <Button onPress={() => navigation.navigate('Dashboard2')} title="Ir a Dashboard 2" />        
      
      </SafeAreaView>
      <StatusBar barStyle="default" />
    </ScrollView>
);

DashboardScreen.navigationOptions = {
  headerTitle: 'Dashboard',
};



const Dashboard2Screen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <SubScreenWrapper banner={'Dashboard 2 Screen'} navigation={navigation} />;




const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    EditProfile: { screen: EditProfile }    
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Text>XX</Text>
      ),
      drawerLabel: 'tu Perfil',
    },
  }
);

const DashboardStack = createStackNavigator(
  {
    Dashboard: { screen: DashboardScreen },
    Dashboard2: { screen: Dashboard2Screen },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Text>XX</Text>
      ),
      drawerLabel: 'Dashboard',
    },
  }
);

const MainNavigation = createDrawerNavigator(
  {
    Dashboard: {
      path: '/dashboard',
      screen: DashboardStack,
    },
    Profile: {
      path: '/profile',
      screen: ProfileStack,
    },
  },

  {
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    initialRouteName: 'Dashboard',
    drawerPosition: 'right',
    contentComponent: MainMenuContents
  }
);


export const MainRouter = createAppContainer(MainNavigation);


