import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";


const Tab = createBottomTabNavigator();
const NestedScreen = createStackNavigator();

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import { authSignOutUser } from "../../redux/auth/authOperations";

const Home = () => {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSignOutUser())
  }
  return (
    <Tab.Navigator
      // tabBarOptions={{ showLabel: false }}
      initialRouteName="Posts"
    >
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Octicons
              name="apps"
              size={24}
              color={!focused ? "#212121" : "#FF6C00"}
            />
          ),
          headerRight: () => (
            <Feather
              onPress={signOut}
              name="log-out"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <AntDesign
              name="pluscircle"
              size={24}
              color={!focused ? "#212121" : "#FF6C00"}
            />
          ),
          // tabBarStyle: {display: "none"}
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <AntDesign
              name="user"
              size={24}
              color={!focused ? "#212121" : "#FF6C00"}
            />
          ),
          headerRight: () => (
            <Feather
              onPress={signOut}
              name="log-out"
              size={24}
              color="black"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    width: 100,
    height: 100,
    color: "black",
  },
});
// test
export default Home;
