import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRoute } from "../router";
import { authStateChangeUser } from "../redux/auth/authOperations";

export const Main = () => {
  const dispatch = useDispatch();
  const { stateChange } = useSelector((state) => state.auth); 
  
  useEffect(() => {
    dispatch(authStateChangeUser(true));
  }, []);

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
