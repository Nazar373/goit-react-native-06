import { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Text,
  FlatList,
  Image
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { collection, doc, addDoc, onSnapshot } from "firebase/firestore";

import { db } from "../../../firebase/config";

const CommentsScreen = ({ route }) => {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentBorderColor, setCommentBorderColor] = useState("#E8E8E8");
  const [commentBackgroundColor, setCommentBackgroundColor] =
    useState("#F6F6F6");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  useEffect(() => {
    getAllComments();
  }, []);

  const { nickName, image } = useSelector((state) => state.auth);

  const uploadCommentToServer = async () => {
    try {
      const PostRef = await doc(db, "posts", postId);
      await addDoc(collection(PostRef, "comments"), {
        comment,
        nickName,
        image,
      });
    } catch (error) {
      console.log("error.message", error.message);
      Alert.alert("try again");
    }
  };
  const getAllComments = async () => {
    const PostRef = await doc(db, "posts", postId);
    onSnapshot(collection(PostRef, "comments"), (data) =>
      setAllComments(
        data.docs.map((doc) => ({
          ...doc.data(),
        }))
      )
    );
  };
  const createComment = () => {
    uploadCommentToServer();
    if(!comment.trim()) {
      Alert.alert('the comment cannot be empty ')
      return
    }
    keyboardHide();
    setComment("");
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.userImage} />
          <FlatList
            data={allComments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback>
              <View style={styles.data}>
                <Image source={{ uri: item.image }} style={styles.dataImage} />
                <Text style={styles.dataComment}>{item.comment}</Text>
              </View>
              </TouchableWithoutFeedback>
            )}
          />
        <View
          style={{
            ...styles.commentContainer,
            marginBottom: isShowKeyboard ? 280 : 15,
          }}
        >
          <TextInput
            style={{
              ...styles.input,
              borderColor: commentBorderColor,
              backgroundColor: commentBackgroundColor,
            }}
            value={comment}
            onChangeText={(value) => setComment(value)}
            placeholder={"Comment..."}
            onFocus={() => {
              setCommentBorderColor("#FF6C00");
              setCommentBackgroundColor("transparent");
              setIsShowKeyboard(true);
            }}
            onBlur={() => {
              setCommentBackgroundColor("#F6F6F6");
              setCommentBorderColor("#E8E8E8");
            }}
          />
          <TouchableOpacity
            style={styles.commentIconSend}
            onPress={createComment}
          >
            <Feather name="arrow-up-circle" size={34} color="#FF6C00" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    marginHorizontal: 16,
  },
  commentContainer: {
    // marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: { width: "100%", height: 240, borderRadius: 8, marginTop: 32 },
  data: { flexDirection: "row", alignItems: "center", marginTop: 32 },
  dataImage: { width: 28, height: 28, borderRadius: 50, marginRight: 16 },
  dataComment: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#00000008",
    color: "#212121",
  },
  input: {
    position: "relative",
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 100,
    color: "#212121",
    padding: 16,
  },
  commentIconSend: {
    position: "absolute",
    right: 15,
  },
});

export default CommentsScreen;
