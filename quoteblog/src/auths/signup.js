import { useState } from 'react'
import axios from 'axios'
import {Form, Button,Row,Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router';
import $ from 'jquery';


export default function Exp({match}) {

  
    const hist = useHistory();
    const [confirm, setConfirm] = useState(false);
    const [signupError, setSignupError] = useState("");
    const [info, setInfo] = useState({
      as : "",
      name : "",
      gender : "",
      dob : "",
      email : "",
      phone : "",
      password : "",
      cpassword : ""
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
      if(e.target.name === "student")
      info.as = "student"
      else info.as = "tutor"
       const {data} = await axios.post('/auth/signup',info);
       console.log(data);
       if(data.status)
       hist.push('/');
       else setSignupError(data.message);

      //  if(!data.status)alert(data.message);
      //  else hist.push('/');
      //  (data)?hist.push('/'):alert('failed');
      // if(info.name && info.gender && info.dob && info.email && info.phone ){
      // const {data} = await axios.post('/tutordetails/'+match.params.id, info);
      // console.log(info);
      // hist.push('/dasht');
      // }
      // else{
      //   alert('all fields are required')
      // }
    }


  return (

    <div id="authPage">
      <h1>Signup</h1>
     
    <Form>
 <p>{signupError}</p>
  <Row className= "mb-3">
    <Col>
    <Form.Group>
        <Form.Label style = {{float : "left"}}>Name</Form.Label>
      <Form.Control placeholder="Name" name="name" onChange ={changeTutorForm} />
      </Form.Group>
    </Col>

  </Row>

  <Row className= "mb-3">
  <Col>
      <Form.Label style = {{float : "left"}}>Gender</Form.Label>
  <Form.Control as="select" name="gender" onChange ={changeTutorForm}>
      <option value="">select</option>
      <option value ="Male">Male</option>
      <option value="Female">Female</option>      
    </Form.Control>
    </Col>
    <Col>
        <Form.Label style = {{float : "left"}}>Date of Birth</Form.Label>
        <Form.Control type="date" name="dob" onChange = {changeTutorForm} required/>  
  </Col>
  </Row>
  <Row>

  <Col>
      <Form.Label style = {{float : "left"}}>Email </Form.Label>

      <Form.Control placeholder="email" name="email" onChange ={changeTutorForm} />
    </Col>

    <Col>
        <Form.Label style = {{float : "left"}}>Phone</Form.Label>
      <Form.Control type = "tel" placeholder="phone" name="phone" onChange ={changeTutorForm} />
    </Col>

  </Row>

  <Row>

<Col>
    <Form.Label style = {{float : "left"}}>Password </Form.Label>
    <Form.Control className="pass" type="password" placeholder="password" name="password" onChange ={changeTutorForm} />
    <div style={{float : "left"}} onMouseLeave = {hidePass} onMouseEnter = {showPass}>show password</div>
  </Col>

  <Col>
      <Form.Label style = {{float : "left"}}>Confirm Password</Form.Label>
    <Form.Control className="pass" type = "password" placeholder="confirm password" name="cpassword" onChange ={changeTutorForm} />
  </Col>

</Row>

  <hr/>

  <Form.Group>
  <Form.Check style={{display : "inline", float : "left", marginRight : "20px"}}
type="checkbox"
name="confirm"
label = "confirm"
onChange ={()=>setConfirm(!confirm)}
/>
</Form.Group>
<Row>
  <Col>
  <Button variant = "success" disabled = {!confirm} name="tutor"  type="submit" onClick = {handleS}>Signup as Tutor</Button>
  </Col><Col>
  <Button variant = "success" disabled = {!confirm} name="student"  type="submit" onClick = {handleS}>Signup as Student</Button>
  </Col>
</Row>
</Form>
<br/>
<p>already have an account ? signin <a href="/">here</a></p>
</div>

  );
}
