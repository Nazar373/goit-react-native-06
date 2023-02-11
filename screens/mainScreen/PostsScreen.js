import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreen from "./nestedScreens/DefaultScreen";
import MapScreen from "./nestedScreens/MapScreen";
import CommentsScreen from "./nestedScreens/CommentsScreen";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
// console.log(route.params)
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{ headerShown: false }}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
      <NestedScreen.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
