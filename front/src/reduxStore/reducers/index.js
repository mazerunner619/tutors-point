import { combineReducers } from "redux";
import authReducer from "./auth";
import classReducer from "./classroom";

const rootReducer = combineReducers({
  authReducer: authReducer,
  classReducer: classReducer,
});

export default rootReducer;
