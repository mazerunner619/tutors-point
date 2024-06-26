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
  SAVE_PROFILE,
  SAVE_PROFILE_FAILURE,
  SAVE_PROFILE_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
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
  saving_profile: false,
  saving_profile_error: null,
  resetting_pass: false,
  resetting_pass_error: null,
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

    case SAVE_PROFILE:
      return { ...state, saving_profile: true, saving_profile_error: null };
    case SAVE_PROFILE_FAILURE:
      return {
        ...state,
        saving_profile: false,
        saving_profile_error: action.payload,
      };
    case SAVE_PROFILE_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload.name,
          gender: action.payload.gender,
          dob: action.payload.dob,
          email: action.payload.email,
          phone: action.payload.phone,
        },
        saving_profile: false,
        saving_profile_error: null,
      };
    }

    case RESET_PASSWORD:
      return { ...state, resetting_pass: true, resetting_pass_error: null };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetting_pass: false,
        resetting_pass_error: action.payload,
      };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, resetting_pass: false };

    default:
      return state;
  }
};

export default authReducer;
