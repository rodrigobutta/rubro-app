import { AsyncStorage, Alert } from "react-native";
import * as Constants from "./Constants";

export function setInitialGlobalValues() {

  // AsyncStorage.getItem(Constants.keyCurrentUser).then(val => {
  //   val ? global.currentUser = JSON.parse(val) : global.currentUser = null;
  //   Constants.debugLog("Current User: " + val);
  // });

  global.currentUser = null;

  global.fullNameTemp = null;
  
}

export function logout() {
  AsyncStorage.removeItem(Constants.keyCurrentUser);
  Constants.emitter.emit(Constants.logoutListener);
}
