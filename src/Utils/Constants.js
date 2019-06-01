var { EventEmitter } = require("fbemitter");

module.exports = {
  alertTitle: "Firebase Auth",
  keyCurrentUser: "currentUser",
  emitter: new EventEmitter(),
  loginListener: "loginListener",
  logoutListener: "logoutListener",
  colors: {
    themeBGColor: "#aaa",
    buttonBGColor: "#888",
    borderColor: "#555",
    whiteTitleColor: "#fff"
  },
  keyLoginNav: {
    keyStack: "Stack",
    keySignUp: "SignUp"
  },
  /// Common Functions
  debugLog: log => {
    console.log("\n====================>");
    console.log(log);
    console.log("<====================\n");
  }
};
