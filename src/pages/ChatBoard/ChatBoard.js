import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducer/Reducer";
import New from "./New";
const store = createStore(reducer);
function ChatBoard() {
  return (
    <div>
      <Provider store={store}>
        <New />
      </Provider>
    </div>
  );
}

export default ChatBoard;
