import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navi from './Navi';
import {BrowserRouter, Route} from 'react-router-dom'
import Signup from './auths/signup'
import { useContext } from 'react';
import AuthContext from './context/authContext';
import Login from './auths/login';
import DashS from './studentDashboard/DashS';
import DashT from './tutorDashboard/DashT';
import ClassroomT from './tutorDashboard/ClassroomT'
import ClassroomS from './studentDashboard/ClassroomS'
import Assignment from './tutorDashboard/Assignment'


function Router() {

  const {logged} =  useContext(AuthContext);
  console.log('logged or not : '+logged);

  return ( 
  <BrowserRouter>
      <Navi />
      
  <Route path = "/" exact>
        <Login />
  </Route>
  <Route path="/dasht" component = {DashT} />
  <Route path="/dashs" component = {DashS} />
  <Route path="/signup" component= {Signup} />
  <Route path="/classroomt/:id" component= {ClassroomT} />
  <Route path="/classrooms/:id/:sid" component= {ClassroomS} />
  <Route path="/assignment/:id" component= {Assignment} />

  
      </BrowserRouter>
  );

}

export default Router;



