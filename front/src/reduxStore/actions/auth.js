import axios from "axios";
import {
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP,
  SIGNUP_SUCCESS,
  LOAD_LOGGED_USER,
  SEND_REQUEST,
  SEND_REQUEST_FAILURE,
  SEND_REQUEST_SUCCESS,
  CLEAR_CLASSROOM,
} from "../actionTypes";

import { setAuthToken } from "../../Utils/utilFunctions";

const clearLocalStorageAndAuthorization = () => {
  localStorage.clear();
  setAuthToken();
};

export const getCurrentUser = (hist) => async (dispatch) => {
  try {
    setAuthToken(localStorage.getItem("jwtToken").slice(1, -1));
    const { data } = await axios.get("/auth/current");
    if (data.data !== null) {
      dispatch({ type: LOGIN_SUCCESS, payload: data.data });
      hist.push(data.data.role === "student" ? "/dashs" : "/dasht");
    } else {
      clearLocalStorageAndAuthorization();
    }
  } catch (error) {
    console.log("getCurrentUser Error => ", error.message);
  }
};

export const acceptRequest = (classroomID, requestID) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `/class/${classroomID}/requests/${requestID}/accept`
    );
    return { status: true, data: data.data };
  } catch (error) {
    if (error.response.data && error.response.data.error) {
      return { status: false, data: error.response.data.error.message };
    } else return { status: false, data: "request not sent! try again later" };
  }
};

export const rejectRequest = (classroomID, requestID) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `/class/${classroomID}/requests/${requestID}/reject`
    );
    return { status: true, data: data.data };
  } catch (error) {
    if (error.response.data && error.response.data.error) {
      return { status: false, data: error.response.data.error.message };
    } else return { status: false, data: "request not sent! try again later" };
  }
};

export const loadLoggedUser = (hist) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN });
    setAuthToken(localStorage.getItem("jwtToken").slice(1, -1));
    const { data } = await axios.get("/auth/current");
    if (data.data == null) {
      clearLocalStorageAndAuthorization();
      dispatch({ type: LOGIN_FAILURE, payload: new Error("please re-login!") });
      hist.push("");
    } else {
      dispatch({ type: LOAD_LOGGED_USER, payload: data.data });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: new Error("please re-login!") });
    hist.push("");
  }
};

export const login = (body, hist) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN });
    const { data } = await axios.post("/auth/login", body);
    dispatch({ type: LOGIN_SUCCESS, payload: data.data });
    localStorage.setItem("jwtToken", JSON.stringify(data.jwtToken));
    localStorage.setItem("role", JSON.stringify(data.data.role));
    setAuthToken(data.jwtToken);
    if (body.role === "Student") {
      hist.push("/dashs");
    } else {
      hist.push("/dasht");
    }
    return 1;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({ type: LOGIN_FAILURE, payload: error.response.data.error });
    } else {
      //unknown error
      dispatch({ type: LOGIN_FAILURE, payload: error });
    }
    return 0;
  }
};

export const signup = (body, hist) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP });
    await axios.post("/auth/signup", body);
    // redirect to login page
    dispatch({ type: SIGNUP_SUCCESS });
    alert("registered, please login to continue");
    hist.push("");
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({ type: SIGNUP_FAILURE, payload: error.response.data.error });
    } else {
      dispatch({ type: SIGNUP_FAILURE, payload: error });
    }
  }
};

export const verifySignupOtp = (otp, hist) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP });
    const userData = JSON.parse(localStorage.getItem("user-data"));
    const { data } = await axios.post("/auth/verify-signup-otp", {
      userData: userData,
      otp: otp,
      email: userData.email,
    });
    dispatch({ type: SIGNUP_SUCCESS });
    alert("registered, please login to continue");
    localStorage.removeItem("user-data");
    hist.push("");
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({ type: SIGNUP_FAILURE, payload: error.response.data.error });
    } else {
      dispatch({ type: SIGNUP_FAILURE, payload: error });
    }
  }
};

export const sendSignupOtp = (body, hist) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP });
    const { token, email, expires } = await axios.post(
      "/auth/send-signup-otp",
      { email: body.email, phone: body.phone, role: body.role }
    );
    alert("check email for otp");
    localStorage.setItem("user-data", JSON.stringify(body));
    dispatch({ type: SIGNUP_SUCCESS });
    hist.push("/signup/verify-otp");
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({ type: SIGNUP_FAILURE, payload: error.response.data.error });
    } else {
      dispatch({ type: SIGNUP_FAILURE, payload: error });
    }
  }
};

export const logout = (hist) => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT });
    await axios.post("/auth/logout");
    dispatch({ type: LOGOUT_SUCCESS });
    dispatch({ type: CLEAR_CLASSROOM });
    localStorage.clear();
    hist.push("");
  } catch (error) {
    console.log("redux error => ", error);
    dispatch({ type: LOGOUT_FAILURE, payload: error });
  }
};
