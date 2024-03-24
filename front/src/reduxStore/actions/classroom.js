import axios from "axios";

import {
  LOAD_CLASS,
  LOAD_CLASS_SUCCESS,
  LOAD_CLASS_FAILURE,
  SEND_REQUEST,
  SEND_REQUEST_FAILURE,
  SEND_REQUEST_SUCCESS,
  LOAD_LOGGED_USER,
  ACCEPT_REQUEST,
  ACCEPT_REQUEST_FAILURE,
  ACCEPT_REQUEST_SUCCESS,
  HANDLE_REQUEST,
  HANDLE_REQUEST_SUCCESS,
  HANDLE_REQUEST_FAILURE,
  NEW_COMMENT_SUCCESS,
  NEW_MEETING_SUCCESS,
  UPLOAD_ASSIGNMENT,
  UPLOAD_ASSIGNMENT_SUCCESS,
  UPLOAD_ASSIGNMENT_FAILURE,
  SUBMIT_ASSIGNMENT_SUCCESS,
} from "../actionTypes";

export const loadClass = (userid, classroomid) => async (dispatch) => {
  console.log("loading class", userid, classroomid);
  try {
    dispatch({ type: LOAD_CLASS });
    if (userid !== undefined) {
      const { data } = await axios.get(
        `/class/student/${userid}/classroom/${classroomid}`
      );
      dispatch({ type: LOAD_CLASS_SUCCESS, payload: data.data });
    } else {
      const { data } = await axios.get(`/class/classroom/${classroomid}`);
      dispatch({ type: LOAD_CLASS_SUCCESS, payload: data.data });
    }
  } catch (error) {
    if (error.response && error.response.data)
      dispatch({
        type: LOAD_CLASS_FAILURE,
        payload: error.response.data.error,
      });
    else dispatch({ type: LOAD_CLASS_FAILURE, payload: error });
  }
};

export const sendRequest = (sid, classroomid) => async (dispatch) => {
  try {
    console.log("sending....!");
    dispatch({ type: SEND_REQUEST });
    const { data } = await axios.post(
      `/class/${sid}/joinclassroom/${classroomid}`
    );
    dispatch({ type: SEND_REQUEST_SUCCESS, payload: data.data });
    alert("request sent!");
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({
        type: SEND_REQUEST_FAILURE,
        payload: error.response.data.error,
      });
      alert(error.response.data.error.message);
    } else {
      dispatch({ type: SEND_REQUEST_FAILURE, payload: error });
      alert(error.message);
    }
  }
};

export const handleRequest =
  (classroomID, studentID, action) => async (dispatch) => {
    try {
      dispatch({ type: HANDLE_REQUEST });
      const { data } = await axios.post(
        `/class/${classroomID}/handlerequest/${studentID}/${action}`
      );
      dispatch({
        type: HANDLE_REQUEST_SUCCESS,
        payload: {
          studentRequests: data.data.studentRequests,
          enrolledStudents: data.data.enrolledStudents,
        },
      });
      alert(`request ${action}ed!`);
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch({
          type: HANDLE_REQUEST_FAILURE,
          payload: error.response.data.error,
        });
      } else {
        dispatch({
          type: HANDLE_REQUEST_FAILURE,
          payload: error,
        });
      }
      alert("couldn't process now!");
    }
  };

export const newComment =
  (userid, classroomid, commentObj) => async (dispatch) => {
    try {
      console.log("commenting", userid, classroomid);
      const { data } = await axios.post(
        `/class/${userid}/comment/${classroomid}`,
        commentObj
      );
      dispatch({ type: NEW_COMMENT_SUCCESS, payload: data.data });
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error.message);
        console.log(error.response.data.error.message);
      } else {
        alert(error.message);
        console.log(error.message);
      }
    }
  };

export const newMeeting =
  (userid, classroomid, meetObj) => async (dispatch) => {
    try {
      console.log("commenting", userid, classroomid);
      const { data } = await axios.post(
        `/class/${userid}/schedulemeet/${classroomid}`,
        meetObj
      );
      dispatch({ type: NEW_MEETING_SUCCESS, payload: data.data });
      alert("meeting schedules");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error.message);
        console.log(error.response.data.error.message);
      } else {
        alert(error.message);
        console.log(error.message);
      }
    }
  };

// ansObj = { topic, subject, description, file : FILE } =? file handled by multer MW
export const addNewAssignment =
  (classroomID, userId, asnObj) => async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_ASSIGNMENT });
      const { data } = await axios.post(
        `/asn/classroom/${classroomID}/new/assignment/${userId}`,
        asnObj
      );
      dispatch({ type: UPLOAD_ASSIGNMENT_SUCCESS, payload: data.data });
      alert("uploaded");
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch({
          type: UPLOAD_ASSIGNMENT_FAILURE,
          payload: error.response.data.error,
        });
      } else {
        dispatch({
          type: UPLOAD_ASSIGNMENT_FAILURE,
          payload: error,
        });
      }
    }
  };

export const submitAssignment = (userid, AID, asnObj) => async (dispatch) => {
  try {
    console.log("assignment submitting");
    dispatch({ type: UPLOAD_ASSIGNMENT });

    await axios.post(`/asn/${userid}/assignment/${AID}/submit`, asnObj);

    dispatch({
      type: SUBMIT_ASSIGNMENT_SUCCESS,
      payload: AID,
    });
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({
        type: UPLOAD_ASSIGNMENT_FAILURE,
        payload: error.response.data.error,
      });
    } else {
      dispatch({
        type: UPLOAD_ASSIGNMENT_FAILURE,
        payload: error,
      });
    }
  }
};
