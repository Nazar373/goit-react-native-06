import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import * as SplashScreen from "expo-splash-screen";

import { db } from "../../../firebase/config";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
// import { Ionicons } from '@expo/vector-icons';
{
  /* <Ionicons name="arrow-back" size={24} color="black" /> */
}

const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const { nickName, email, image } = useSelector((state) => state.auth);
  const getAllPosts = async () => {
    onSnapshot(collection(db, "posts"), (data) =>
      setPosts(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      )
    );
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const [fontsLoaded] = useFonts({
    Regular: require("../../../assets/fonts/Roboto-Regular.ttf"),
    Bold: require("../../../assets/fonts/Roboto-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Image source={{ uri: image }} style={styles.userImage} />
          <View style={styles.userData}>
            <Text style={styles.userNickName}>{nickName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.photo }} style={styles.itemPhoto} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.itemButtons}>
                <Button
                  title="Comments"
                  onPress={() => navigation.navigate("Comments", {postId: item.id, photo: item.photo})}
              />
                <Button
                  title={item.titleLocation}
                  onPress={() =>
                    navigation.navigate("Map", { location: item.location })
                  }
                />
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 16 },
  userContainer: {
    paddingTop: 32,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: { width: 60, height: 60, borderRadius: 16 },
  userData: { margin: 8 },
  userNickName: {
    fontFamily: "Bold",
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Regular",
    color: "#212121",
  },
  itemContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: { fontFamily: "Bold", color: "#212121", paddingTop: 8 },
  itemPhoto: { width: "100%", height: 240, borderRadius: 8 },
  itemButtons: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-between",
  },
});

export default DefaultScreen;
