import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./reduxStore/index";
import "./bootswatch/bootstrap.min 5c.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { LOGOUT } from "./reduxStore/actionTypes";

import { setAuthToken } from "./Utils/utilFunctions";

const clearLocalStorageAndAuthorization = () => {
  localStorage.clear();
  setAuthToken();
};

axios.interceptors.request.use(
  (req) => {
    if (localStorage.getItem("jwtToken"))
      req.headers.Authorization = `Bearer ${localStorage
        .getItem("jwtToken")
        .slice(1, -1)}`;
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    console.log("in react interceptor response |  no error");
    return res;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("in react interceptor response |  401");
      clearLocalStorageAndAuthorization();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
