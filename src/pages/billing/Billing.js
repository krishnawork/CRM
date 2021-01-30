import React from "react";
import Page from "./page";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducer/Reducer";
const store = createStore(reducer);
function Billing() {
  return (
    <div>
      <Provider store={store}>
        <Page />
      </Provider>
    </div>
  );
}

export default Billing;
