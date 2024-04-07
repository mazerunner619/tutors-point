// Auth actions
export const LOAD_LOGGED_USER = "LOAD_LOGGED_USER";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const SIGNUP = "SIGNUP";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

// classroom actions
// for student -> all excluding pending request
// for tutor -> all classroom details

export const CLEAR_CLASSROOM = "CLEAR_CLASSROOM";
export const LOAD_CLASS = "LOAD_CLASS";
export const LOAD_CLASS_SUCCESS = "LOAD_CLASS_SUCCESS";
export const LOAD_CLASS_FAILURE = "LOAD_CLASS_FAILURE";

export const LOAD_ENROLLED_CLASSES = "LOAD_ENROLLED_CLASSES";
export const LOAD_REQUESTED_CLASSES = "LOAD_REQUESTED_CLASSES";

export const HANDLE_REQUEST = "HANDLE_REQUEST";
export const HANDLE_REQUEST_SUCCESS = "HANDLE_REQUEST_SUCCESS";
export const HANDLE_REQUEST_FAILURE = "HANDLE_REQUEST_FAILURE";

export const SEND_REQUEST = "SEND_REQUEST";
export const SEND_REQUEST_SUCCESS = "SEND_REQUEST_SUCCESS";
export const SEND_REQUEST_FAILURE = "SEND_REQUEST_FAILURE";

export const NEW_COMMENT_SUCCESS = "NEW_COMMENT_SUCCESS";
export const NEW_MEETING_SUCCESS = "NEW_MEETING_SUCCESS";

// assignment actions
export const LOAD_CLASS_ASSIGNMENTS = "LOAD_CLASS_ASSIGNMENTS";

// used for tutor->new assign create & student->submit an assignment
export const UPLOAD_ASSIGNMENT = "UPLOAD_ASSIGNMENT";
export const UPLOAD_ASSIGNMENT_SUCCESS = "UPLOAD_ASSIGNMENT_SUCCESS";
export const UPLOAD_ASSIGNMENT_FAILURE = "UPLOAD_ASSIGNMENT_FAILURE";
export const SUBMIT_ASSIGNMENT_SUCCESS = "SUBMIT_ASSIGNMENT_SUCCESS";

export const EVALUATE_ASSIGNMENT = "EVALUATE_ASSIGNMENT";

// otp
export const OTP_LENGTH = 4;
