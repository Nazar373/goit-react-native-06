import { Camera } from "expo-camera";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

import { db } from "../../firebase/config";

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [titleLocation, setTitleLocation] = useState("");
  const [location, setLocation] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [titleBorderColor, setTitleBorderColor] = useState("#E8E8E8");
  const [titleBackgroundColor, setTitleBackgroundColor] = useState("#F6F6F6");
  const [titleLocationBorderColor, setTitleLocationBorderColor] =
    useState("#E8E8E8");
  const [titleLocationBackgroundColor, setTitleLocationBackgroundColor] =
    useState("#F6F6F6");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // console.log("latitude",location.coords.latitude)
      // console.log("longitude",location.coords.longitude)
    })();
  }, []);

  const { userId, nickName, email } = useSelector((state) => state.auth);
  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    // console.log({photo, location})
    setPhoto(photo.uri);
  };

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();

      const storage = getStorage();
      const starsRef = ref(storage, `postImages/${uniquePostId}`);

      const uploadPhoto = await uploadBytes(starsRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      const processedPhoto = await getDownloadURL(starsRef);

      return processedPhoto;
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPostToServer = async () => {
    try {
      const photo = await uploadPhotoToServer();
      const postRef = await addDoc(collection(db, "posts"), {
        photo,
        location: location.coords,
        title,
        titleLocation,
        userId,
        nickName,
        email
      });
    } catch (error) {
      console.log(error.message)
      Alert.alert("try again")
    }
  };

  const sendPost = async () => {
    if(!title.trim()) {
      Alert.alert('Field "title" is required')
    }
    if(!location ) {
      Alert.alert('The location did not uploaded. Try again')
    }

    uploadPostToServer();

    keyboardHide();

    navigation.navigate("DefaultScreen");

    setPhoto("");
    setTitle("");
    setTitleLocation("");
    setLocation(null);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.takePhotoContainer}>
              <Image
                source={{ uri: photo }}
                style={{ height: 200, width: 200 }}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={takePhoto}
            ref={setCamera}
            style={styles.snapContainer}
          >
            <Text style={styles.snap}>SNAP</Text>
          </TouchableOpacity>
        </Camera>
        <View
          style={{
            ...styles.form,
            marginBottom: isShowKeyboard ? -90 : 179,
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={{
                ...styles.input,
                borderColor: titleBorderColor,
                backgroundColor: titleBackgroundColor,
              }}
              value={title}
              onChangeText={(value) => setTitle(value)}
              placeholder={"Title"}
              onFocus={() => {
                setTitleBorderColor("#FF6C00");
                setTitleBackgroundColor("transparent");
                setIsShowKeyboard(true);
              }}
              onBlur={() => {
                setTitleBackgroundColor("#F6F6F6");
                setTitleBorderColor("#E8E8E8");
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={{
                ...styles.input,
                borderColor: titleLocationBorderColor,
                backgroundColor: titleLocationBackgroundColor,
              }}
              value={titleLocation}
              onChangeText={(value) => setTitleLocation(value)}
              placeholder={"Location"}
              onFocus={() => {
                setTitleLocationBorderColor("#FF6C00");
                setTitleLocationBackgroundColor("transparent");
                setIsShowKeyboard(true);
              }}
              onBlur={() => {
                setTitleLocationBackgroundColor("#F6F6F6");
                setTitleLocationBorderColor("#E8E8E8");
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.7}
            onPress={sendPost}
          >
            <Text style={styles.btnTitle}>Publish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    marginHorizontal: 16,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  takePhotoContainer: {
    borderColor: "green",
    borderWidth: 1,
  },
  snapContainer: {
    borderRadius: 50,
    borderColor: "red",
    borderWidth: 1,
    marginBottom: 20,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  snap: {
    color: "#fff",
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,
    color: "#212121",
    padding: 16,
  },
  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    marginTop: 43,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16
  },
  btnTitle: {
    color: "#fff"
  }
});

export default CreatePostsScreen;
