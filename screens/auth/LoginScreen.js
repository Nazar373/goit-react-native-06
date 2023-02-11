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
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";

import { authSignInUser } from "../../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const window = Dimensions.get("window").width - 16 * 2;

const LoginScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dimensions, setDimensions] = useState(window);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const dispatch = useDispatch();

  const [emailBorderColor, setEmailBorderColor] = useState("#E8E8E8");
  const [passwordBorderColor, setPasswordBorderColor] = useState("#E8E8E8");
  const [emailBackgroundColor, setEmailBackgroundColor] = useState("#F6F6F6");
  const [passwordBackgroundColor, setPasswordBackgroundColor] =
    useState("#F6F6F6");

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
    dispatch(authSignInUser({email, password}))
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setEmail("");
    setPassword("");
    // navigation.navigate("Home");
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
                  marginBottom: isShowKeyboard ? -90 : 179,
                  width: dimensions,
                }}
              >
                <Text style={styles.title}>Log in</Text>
                <View>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: emailBorderColor,
                      backgroundColor: emailBackgroundColor,
                    }}
                    value={email}
                    onChangeText={(value) => setEmail(value)}
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
                    iconPosition="right"
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
                  <Text style={styles.btnTitle}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Registration")}
                  activeOpacity={0.7}
                >
                  {/* <Button title="Don't have an account? Sign up"
                  style={styles.btnRelocate}
                  onPress={() => navigation.navigate("Registration")}
                   /> */}
                  <Text style={styles.btnRelocate}>
                    Don't have an account? Sign up
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

export default LoginScreen;
