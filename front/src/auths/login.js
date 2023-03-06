import { useState, useContext } from 'react'
import axios from 'axios'
import {Form, Button,Row,Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router';
import $ from 'jquery';
import AuthContext from '../context/authContext'


export default function Exp({match}) {

  const {logged, getLogged , loggedUser} = useContext(AuthContext);

    const hist = useHistory();
    const [loginError, setLoginError] = useState("");
    const [info, setInfo] = useState({
      email : "",
      password : "",
      as : ""
    });

    function changeTutorForm(e){
      const {name, value} = e.target;
      setInfo( prev => { return{...prev, [name] : value}});
    }

    function showPass(){
      $(".pass").attr("type", "text");
    }
    
    function hidePass(){
      $(".pass").attr("type", "password");
    }
    async function handleS(e){
      e.preventDefault();
      info.as = (e.target.name === "student")?"student":"tutor";
      if(info.email && info.password){
       const {data} = await axios.post('/auth/login',info);
       if(data.status){
        getLogged();
        (info.as === "student")?hist.push('/dashs'):hist.push('/dasht');
       }else
       setLoginError(data.message);   
      }
      else{
        alert('all fields are required')
      }
    }


  return (

    <div id="authPage">
      <h1>Signin</h1>
     
    <Form>
    <Form.Group>
        <Form.Label style = {{float : "left"}}>Email</Form.Label>
      <Form.Control placeholder="email" name="email" onChange ={changeTutorForm} />

      <Form.Label style = {{float : "left"}}>Password</Form.Label>
      <Form.Control className="pass" type="password" placeholder="password" name="password" onChange ={changeTutorForm} />
      <div style={{float : "left"}} onMouseLeave = {hidePass} onMouseEnter = {showPass}>show password</div>
      </Form.Group>
<br/>
<br/>
  <Button style={{display : "inline"}} variant = "success" name="tutor"  type="submit" onClick = {handleS}>Signin as Tutor</Button>
{' '}
  <Button variant = "success" name="student"  type="submit" onClick = {handleS}>Signin as Student</Button>

  {/* <Button><a href="http://localhost:5000/auth/google">Signin with Google</a></Button> */}
</Form>
<p style={{color : "red"}}>{loginError}</p>

<p>not registered ? signup <a href="/signup">here</a></p>
</div>

  );
}
