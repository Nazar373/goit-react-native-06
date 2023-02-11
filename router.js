import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = createStackNavigator();

import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegistrationScreen";
import Home from "./screens/mainScreen/Home";

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegisterScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen options={{ headerShown: false }} name="Home" component={Home} />
      </AuthStack.Navigator>
    );
  }
  return (
    <Home />
  )
};
