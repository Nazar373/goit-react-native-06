import { LogBox } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { Main } from "./components/Main";

LogBox.ignoreLogs(["Remote debugger"]);

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
