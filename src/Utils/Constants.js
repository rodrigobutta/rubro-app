var { EventEmitter } = require("fbemitter");

module.exports = {
  alertTitle: "Rubro",  
  emitter: new EventEmitter(),
  logoutListener: "logoutListener",
  colors: {
    themeBGColor: "#ffffff",
    buttonBGColor: "#ccc",
    borderColor: "#777",
    textColor: "#111"
  },
  keyLoginNav: {
    keyStack: "Stack",
    keySignUp: "SignUp"
  },
  /// Common Functions
  debugLog: log => {
    console.log("\n====================>");
    console.log(log);  
  }
};
