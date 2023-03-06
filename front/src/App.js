import './App.css';
import Router from './ParentRouter';


import axios from 'axios';
import { AuthContextProvider } from './context/authContext';
axios.defaults.withCredentials = true;

function App() {

  return (
    <>
    <AuthContextProvider>
    <Router />
    </AuthContextProvider>
    </>    
  );

}
export default App;



