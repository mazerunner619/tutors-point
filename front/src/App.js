import "./App.css";
import Router from "./ParentRouter";

import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Router />
    </>
  );
}
export default App;
