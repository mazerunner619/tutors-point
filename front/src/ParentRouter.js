import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navi from "./Navi";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Signup from "./auths/signup";
import verifySignupOtp from "./auths/verifySignupOtp";
import Login from "./auths/login";
import DashS from "./studentDashboard/DashS";
import DashT from "./tutorDashboard/DashT";
import ClassroomT from "./tutorDashboard/ClassroomT";
import ClassroomS from "./studentDashboard/ClassroomS";
import Assignment from "./tutorDashboard/Assignment";
import Profile from "./auths/profile";
import resetPassword from "./auths/resetPassword";
import resetPasswordLink from "./auths/resetPasswordLink";

function Router() {
  return (
    <BrowserRouter>
      <Navi />
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/dasht" component={DashT} />
        <Route path="/dashs" component={DashS} />
        <Route path="/profile" component={Profile} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signup/verify-otp" component={verifySignupOtp} />
        <Route path="/classroomt/:id" component={ClassroomT} />
        <Route path="/classrooms/:id/:sid" component={ClassroomS} />
        <Route path="/assignment/:id" component={Assignment} />
        <Route path="/password/reset/link" component={resetPasswordLink} />
        <Route path="/password/reset/:token" exact component={resetPassword} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
