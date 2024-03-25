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
} from "../actionTypes";

const initialState = {
  loading: false,
  user: null,
  login_error: null,
  signup_error: null,
  logout_error: null,
  request_error: null,
  request_in_progress: false,
  send_request_processing: false,
  send_request_error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true, login_error: null, user: null };

    case LOGIN_FAILURE:
      return { ...state, loading: false, login_error: action.payload };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        login_error: null,
      };

    case SIGNUP:
      return { ...state, loading: true };

    case SIGNUP_FAILURE:
      return { ...state, loading: false, signup_error: action.payload };

    case SIGNUP_SUCCESS:
      return { ...state, loading: false, signup_error: null };
    case LOGOUT:
      return { ...state, loading: true };

    case LOGOUT_SUCCESS:
      return initialState;

    case LOGOUT_FAILURE:
      return { ...state, loading: false, logout_error: action.payload };

    case LOAD_LOGGED_USER:
      return {
        ...state,
        loading: false,
        login_error: null,
        user: action.payload,
      };

    case SEND_REQUEST:
      return {
        ...state,
        send_request_error: null,
        send_request_processing: true,
      };

    case SEND_REQUEST_FAILURE:
      return {
        ...state,
        send_request_processing: false,
        send_request_error: action.payload,
      };

    case SEND_REQUEST_SUCCESS:
      return {
        ...state,
        send_request_processing: false,
        user: {
          ...state.user,
          requestedClasses: [action.payload, ...state.user.requestedClasses],
        },
      };

    default:
      return state;
  }
};

export default authReducer;
