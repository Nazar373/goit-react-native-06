import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { Alert } from "react-native";

import { auth } from "../../firebase/config";
import { authSlice } from "./authSlice";

const {updateUserProfile, authSignOut, authStateChange} = authSlice.actions;

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user", user);
    } catch (error) {
      console.log("error:", error);
      console.log("error.message:", error.message);
      Alert.alert('try again')
    }
  };

export const authSignUpUser =
  ({ login, email, password, image }) =>
  async (dispatch, getState) => {
    try {
      // const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: image,
      });
      const { uid, displayName, photoURL } = await auth.currentUser;
      dispatch(updateUserProfile({
          userId: uid,
          nickName: displayName,
          email,
          image: photoURL,
        })
      );
    } catch (error) {
      console.log("error:", error);
      console.log("error.message:", error.message);
      Alert.alert('try again')
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  await auth.signOut()
  dispatch(authSignOut())
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        authStateChange({
          stateChange: true,
        })
      );
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
          image: user.photoURL,
          email: user.email
        })
      );
    }
  });
};
