import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./reduxStore/index";
// import 'bootstrap/dist/css/bootstrap.min';
import "./bootswatch/bootstrap.min 5c.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
