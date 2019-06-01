import { AsyncStorage, Alert } from "react-native";
import * as Constants from "./Constants";

export function setInitialGlobalValues() {
  AsyncStorage.getItem(Constants.keyCurrentUser).then(val => {
    val ? global.currentUser = JSON.parse(val) : global.currentUser = null;
    Constants.debugLog("Current User: " + val);
  });
  global.fullNameTemp = null
}

export function showAlert(
  message,
  title = Constants.alertTitle,
  buttonTitle = "OK"
) {
  setTimeout(() => {
    Alert.alert(baseLocal.t(title), message, [{ text: buttonTitle }]);
  }, 200);
}

export function logout() {
  AsyncStorage.removeItem(Constants.keyCurrentUser);
  Constants.emitter.emit(Constants.logoutListener);
}
