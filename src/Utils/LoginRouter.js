import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import EmailLogin from "../Login/EmailLogin";
import PhoneLogin from "../Login/PhoneLogin";
import FBLogin from "../Login/FBLogin";
import GoogleLogin from "../Login/GoogleLogin";
import AnonymousLogin from "../Login/AnonymousLogin";

const LoginTab = createAppContainer(
  createBottomTabNavigator(
    {
      EmailLogin: EmailLogin,
      PhoneLogin:PhoneLogin,
      FBLogin:FBLogin,
      GoogleLogin:GoogleLogin,
      AnonymousLogin:AnonymousLogin
    },
    {
      tabBarOptions: {
        activeBackgroundColor: "#ddd",
        inactiveBackgroundColor: "#fff"
      }
    }
  )
);

export default LoginTab;
