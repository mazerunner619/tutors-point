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
  LOAD_CLASS,
  LOAD_CLASS_FAILURE,
  LOAD_CLASS_SUCCESS,
  HANDLE_REQUEST,
  HANDLE_REQUEST_FAILURE,
  HANDLE_REQUEST_SUCCESS,
  SEND_REQUEST_FAILURE,
  SEND_REQUEST_SUCCESS,
  NEW_COMMENT_SUCCESS,
  NEW_MEETING_SUCCESS,
  UPLOAD_ASSIGNMENT,
  UPLOAD_ASSIGNMENT_FAILURE,
  UPLOAD_ASSIGNMENT_SUCCESS,
  SUBMIT_ASSIGNMENT_SUCCESS,
} from "../actionTypes";

const initialState = {
  loading: false,
  class_: null,
  class_error: null,
  request_processing: false,
  request_error: null,
  upload_assignment_processing: false, // for student -> submission purpose | for tutor -> new assignment upload purpose
  upload_assignment_error: null, // "" "" ""
};

const classReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CLASS:
      return { ...state, loading: true, class_error: null, class_: null };

    case LOAD_CLASS_SUCCESS:
      return { ...state, loading: false, class_: action.payload };

    case LOAD_CLASS_FAILURE:
      return { ...state, loading: false, class_error: action.payload };

    case HANDLE_REQUEST:
      return { ...state, request_processing: true, request_error: null };

    case HANDLE_REQUEST_FAILURE:
      return {
        ...state,
        request_processing: false,
        request_error: action.payload,
      };

    case HANDLE_REQUEST_SUCCESS:
      return {
        ...state,
        class_: {
          ...state.class_,
          studentRequests: action.payload.studentRequests,
          enrolledStudents: action.payload.enrolledStudents,
        },
        request_processing: false,
      };

    case NEW_COMMENT_SUCCESS:
      return {
        ...state,
        class_: {
          ...state.class_,
          comments: [...state.class_.comments, action.payload],
        },
      };

    case NEW_MEETING_SUCCESS:
      return {
        ...state,
        class_: {
          ...state.class_,
          meeting: action.payload,
        },
      };

    case UPLOAD_ASSIGNMENT:
      return {
        ...state,
        upload_assignment_error: null,
        upload_assignment_processing: true,
      };

    case UPLOAD_ASSIGNMENT_FAILURE:
      return {
        ...state,
        upload_assignment_error: action.payload,
        upload_assignment_processing: false,
      };

    case UPLOAD_ASSIGNMENT_SUCCESS: {
      return {
        ...state,
        upload_assignment_processing: false,
        class_: {
          ...state.class_,
          assignments: [action.payload, ...state.class_.assignments],
        },
      };
    }

    case SUBMIT_ASSIGNMENT_SUCCESS: {
      const id = action.payload;
      const updatedAsn = state.class_.assignments.map((asn) => {
        if (id.toString() === asn._id.toString()) {
          return {
            ...asn,
            turned: true,
            evaluated: false,
            result: { score: null, remarks: null },
          };
        } else {
          return asn;
        }
      });

      return {
        ...state,
        upload_assignment_processing: false,
        class_: {
          ...state.class_,
          assignments: updatedAsn,
        },
      };
    }

    default:
      return state;
  }
};

export default classReducer;
