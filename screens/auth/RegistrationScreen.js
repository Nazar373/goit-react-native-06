import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
  Button,
  Image,
  Alert,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";

import AddPhoto from "../../assets/add.png";
import DeletePhoto from "../../assets/delete.png";
import { authSignUpUser } from "../../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const RegisterScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");

  const dispatch = useDispatch();

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const [loginBorderColor, setLoginBorderColor] = useState("#E8E8E8");
  const [emailBorderColor, setEmailBorderColor] = useState("#E8E8E8");
  const [passwordBorderColor, setPasswordBorderColor] = useState("#E8E8E8");
  const [loginBackgroundColor, setLoginBackgroundColor] = useState("#F6F6F6");
  const [emailBackgroundColor, setEmailBackgroundColor] = useState("#F6F6F6");
  const [passwordBackgroundColor, setPasswordBackgroundColor] =
    useState("#F6F6F6");

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onSubmit = () => {
    if(!image) {
      Alert.alert('add image please')
      return
    }
    dispatch(authSignUpUser({ login, email, password, image }));
    keyboardHide();
    setLogin("");
    setEmail("");
    setPassword("");
  };

  return (
    <TouchableWithoutFeedback
      onPress={keyboardHide}
      onLayout={onLayoutRootView}
    >
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
                  ...styles.form,
                  marginBottom: isShowKeyboard ? -90 : 113,
                  width: dimensions,
                }}
              >
                <View style={styles.photo}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {
                      image ? (
                        <>
                          <Image
                            source={{ uri: image }}
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 16,
                            }}
                          />
                          <TouchableOpacity onPress={pickImage}>
                            <Image
                              source={DeletePhoto}
                              style={{
                                position: "absolute",
                                right: -80,
                                top: -46,
                              }}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        // <Button onPress={pickImage}>
                        // {/* <AddPhoto /> */}
                        <TouchableOpacity onPress={pickImage}>
                          <Image source={AddPhoto} style={styles.addIcon} />
                        </TouchableOpacity>
                      )
                      // </Button>
                    }
                  </View>
                </View>
                <Text style={{ ...styles.title, marginTop: 32 }}>
                  Registration
                </Text>
                <View>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: loginBorderColor,
                      backgroundColor: loginBackgroundColor,
                    }}
                    value={login}
                    placeholder={"Login"}
                    onFocus={() => {
                      setLoginBorderColor("#FF6C00");
                      setLoginBackgroundColor("transparent");
                      setIsShowKeyboard(true);
                    }}
                    onBlur={() => {
                      setLoginBackgroundColor("#F6F6F6");
                      setLoginBorderColor("#E8E8E8");
                    }}
                    onChangeText={(value) => setLogin(value)}
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: emailBorderColor,
                      backgroundColor: emailBackgroundColor,
                    }}
                    value={email}
                    placeholder={"Email"}
                    onFocus={() => {
                      setEmailBorderColor("#FF6C00");
                      setEmailBackgroundColor("transparent");
                      setIsShowKeyboard(true);
                    }}
                    onBlur={() => {
                      setEmailBackgroundColor("#F6F6F6");
                      setEmailBorderColor("#E8E8E8");
                    }}
                    onChangeText={(value) => setEmail(value)}
                  />
                </View>
                <View style={{ marginTop: 16, position: "relative" }}>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: passwordBorderColor,
                      backgroundColor: passwordBackgroundColor,
                    }}
                    maxLength={15}
                    secureTextEntry={passwordVisibility}
                    value={password}
                    placeholder={"Password"}
                    onBlur={() => {
                      setPasswordBorderColor("#E8E8E8");
                      setPasswordBackgroundColor("#F6F6F6");
                    }}
                    onFocus={() => {
                      setPasswordBorderColor("#FF6C00");
                      setPasswordBackgroundColor("transparent");
                      setIsShowKeyboard(true);
                    }}
                    onChangeText={(value) => setPassword(value)}
                  />
                  {password && (
                    <Pressable
                      onPress={handlePasswordVisibility}
                      style={{ position: "absolute", right: 16, top: 16 }}
                    >
                      <Text style={styles.showField}>
                        {passwordVisibility ? "Show" : "Hide"}
                      </Text>
                    </Pressable>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.7}
                  onPress={onSubmit}
                >
                  <Text style={styles.btnTitle}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnRelocate}>
                    Already have an account? Sign in
                  </Text>
                </TouchableOpacity>
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
    backgroundColor: "#fff",
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
    marginTop: 32,
    marginBottom: 32,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  form: {
    // marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,
    color: "#212121",
    padding: 16,
  },
  showField: {
    fontFamily: "Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "right",
    color: "#1B4371",
  },
  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    marginTop: 43,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    fontFamily: "Regular",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#FFFFFF",
  },
  btnRelocate: {
    fontFamily: "Regular",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1B4371",
    paddingTop: 16,
  },
});

export default RegisterScreen;
