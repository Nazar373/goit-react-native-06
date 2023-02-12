import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { EvilIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 


import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import AddPhoto from "../../assets/add.png";
import DeletePhoto from "../../assets/delete.png";
import { db } from "../../firebase/config";

SplashScreen.preventAutoHideAsync();

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const { image, nickName, userId } = useSelector((state) => state.auth);

  const getUserPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    onSnapshot(q, (data) =>
      setUserPosts(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      )
    );
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", (window) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, [dimensions]);

  const [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/Roboto-Regular.ttf"),
    Bold: require("../../assets/fonts/Roboto-Bold.ttf"),
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  return (
    <TouchableWithoutFeedback onLayout={onLayoutRootView}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/backgroundImg.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.backgroundForm}>
              <View
                style={{
                  width: dimensions,
                  height: 500
                }}
              >
                <View style={styles.photo}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {/* {image ? ( */}
                      {/* <> */}
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 16,
                          }}
                        />
                  </View>
                </View>
                <Text style={{ ...styles.title }}>{nickName}</Text>
                <View style={{flex: 1}}>
                <FlatList
                  data={userPosts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback>
                      <View style={styles.itemContainer}>
                        <Image
                          source={{ uri: item.photo }}
                          style={styles.itemPhoto}
                        />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <View style={styles.itemRoutes}>
                          <View style={styles.itemComment}>
                          <TouchableOpacity onPress={() =>
                              navigation.navigate("Comments", {
                                postId: item.id,
                                photo: item.photo,
                              })
                            }>
                          <EvilIcons name="comment" size={24} color="#FF6C00" />
                          <Text>Comments</Text>
                          </TouchableOpacity>
                          </View>
                          <View style={styles.itemMap}><TouchableOpacity onPress={() =>
                              navigation.navigate("Map", {
                                location: item.location,
                              })
                            }>
                          <Feather name="map-pin" size={24} color="#FF6C00" />
                          </TouchableOpacity></View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  )}/>
                </View>
                
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backgroundForm: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  photo: {
    marginLeft: "auto",
    marginRight: "auto",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    alignItems: "flex-end",
  },
  addIcon: {
    height: 25,
    width: 25,
    bottom: -36,
    right: -13,
  },
  title: {
    fontFamily: "Bold",
    fontSize: 30,
    marginTop: -32,
    marginBottom: 32,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  itemContainer: {
    marginBottom: 10,
    justifyContent: "center",
    // alignItems: "center",
  },
  itemTitle: { fontFamily: "Bold", color: "#212121", paddingTop: 8 },
  itemPhoto: { width: "100%", height: 240, borderRadius: 8 },
  itemRoutes: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ProfileScreen;
