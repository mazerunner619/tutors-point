import axios from "axios";

import {
  LOAD_MY_ASSIGNMENTS,
  LOAD_MY_ASSIGNMENTS_FAILURE,
  LOAD_MY_ASSIGNMENTS_SUCCESS,
} from "../actionTypes";

export const loadAssignments = (role) => async (dispatch) => {
  try {
    dispatch({ type: LOAD_MY_ASSIGNMENTS });

    dispatch({ type: LOAD_MY_ASSIGNMENTS_SUCCESS });
  } catch (error) {
    dispatch({ type: LOAD_MY_ASSIGNMENTS_FAILURE });
  }
};
