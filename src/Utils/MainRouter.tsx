import React from "react";
import {  
  Text,  
  ScrollView, 
  StatusBar,
  Button
} from "react-native";
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  SafeAreaView,
} from 'react-navigation';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

import { ButtonWithMargin } from '../commonComponents/ButtonWithMargin';
import MainMenuContents from "./MainMenu";

import Home from "../Home/Home";
import Profile from "../Profile/Profile";
import EditProfile from "../Profile/Edit";

import Agenda from '../modules/agenda/agenda';

import RequestInitModule from "../modules/request/InitModule";
import RequestFormModule from "../modules/request/FormModule";
import RequestViewModule from "../modules/request/ViewModule";



const SubScreenWrapper = ({
  navigation,
  banner,
}: {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
}) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>      
      <ButtonWithMargin onPress={() => navigation.openDrawer()} title="Menú" />
      <ButtonWithMargin onPress={() => navigation.navigate('Dashboard2')} title="Directo Dashboard 2" />
      <ButtonWithMargin onPress={() => navigation.navigate('Index')} title="Volver" />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);




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
    Dashboard: { screen: Home },
    Dashboard2: { screen: Dashboard2Screen },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Text>XX</Text>
      ),
      drawerLabel: 'Dashboard'
    },
  }
);

const RequestStack = createStackNavigator(
  {
    RequestInitModule: { screen: RequestInitModule },
    RequestViewModule: { screen: RequestViewModule },
    RequestFormModule: { screen: RequestFormModule },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Text>XX</Text>
      ),
      drawerLabel: 'Pedidoddd'
    },
  }
);


// export const navigationOptionsHeader=({navigation})=>{
  
//   return {    
//     headerRight: (
//       <Button
//         onPress={() => navigation.toggleDrawer()}
//         title="Info"
//         color="#222"
//       />
//     )
//   };

// }


export const MainNavigation = createDrawerNavigator(
  {
    Dashboard: {
      path: '/dashboard',
      screen: DashboardStack,
    },
    Profile: {
      path: '/profile',
      screen: ProfileStack,
    },
    Request: {
      path: '/request',
      screen: RequestStack,
    },    
    Agenda: {
      path: '/agenda',
      screen: Agenda,
    },
  },

  {
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    initialRouteName: 'Dashboard',
    drawerPosition: 'left',
    contentComponent: MainMenuContents,
    // navigationOptions: {     
    //   headerLayoutPreset: 'center'
    // },
    // defaultNavigationOptions: {
    //   headerTitleStyle: { alignSelf: 'center' },
    // },
    // navigationOptions: navigationOptionsHeader
  }
);



export default MainRouter = createAppContainer(MainNavigation);