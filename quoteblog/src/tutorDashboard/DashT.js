import {useState,useEffect, useContext} from 'react'
import axios from 'axios'
import { Button, Tabs,Tab ,Accordion, Spinner, Form, Card, ListGroup, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import AuthContext from '../context/authContext';
import Classroom from './ClassroomT';
import {IoIosAdd} from 'react-icons/io';



export default function DashT() {

  const {logged, getLogged, loggedUser} = useContext(AuthContext);

  const [confirm, setConfirm] = useState(true);
  const [classes, setClasses] = useState([]);
  const [reRender, setRerender] = useState(0);
  const [loading, setLoading] = useState(false);

  const [classForm, setClassForm] = useState({
    className  :"",
    subject : "",
    description : ""
  });

  //from totors db get scheduled classes

  useEffect( () => {
    const fetchData = async(f)=>{
    const {classes} = await f();
     setClasses(classes);
    }
    fetchData(getLogged);
  }, [reRender]);

async function createClassroom(e){
  if(classForm.className && classForm.subject && classForm.description){
    setLoading(true);
    console.log('called create classroom');
  const {data} = await axios.post(`auth/${loggedUser._id}/classroom/new`, classForm);
  console.log(data);
  setClassForm({
    className  :"",
    subject : "",
    description : ""
  });
  setLoading(false);
  setRerender(reRender === 0 ? 1:0);
  }
  else{
    alert('you\'re missing some fileds !');
  }
}

function changeClassForm(e){
  const {name, value} = e.target;
  setClassForm({...classForm, [name] : value});
}

const classRoomArray = classes.map( CLASS => 
        <Col sm={10} md={6} lg={4}>
        <LinkContainer to = {'/classroomt/'+CLASS._id} style= {{ cursor : "pointer" }}>
        <Card className="mx-2 my-3 p-3 classCards" bg="light">
          <Card.Header>
          <Card.Title>
            {CLASS.className}{' '}<span className = "text-muted p-0" style={{float : "right"}}>{CLASS.subject}</span>
          </Card.Title>
            </Card.Header>
        <Card.Body>
            <Card.Text>
           {CLASS.description}
            </Card.Text>
            <div className="my-3" style={{color: 'goldenrod'}}>
            {CLASS.assignments.length} Assignments<br/>
            {/* {CLASS.tests.length} Tests<br/> */}
            {CLASS.enrolledStudents.length} Student(s) <br/>
            <b style={{color : "red"}}>{CLASS.studentRequests.length} pending request(s)</b>
            </div>
        </Card.Body>
        </Card>
        </LinkContainer>
        </Col>
);

  return (
    <>
    {
      logged ? 
  <div id="dashboard">

<Tabs 
style={{fontWeight : "bolder"}}
defaultActiveKey="#link3" id="uncontrolled-tab-example" className="mb-3">

<Tab eventKey="#link3" title="My Classrooms">

<Accordion className="m-3">

<Card className = "accor-card" style={{border : "0"}}>
<Card.Header style={{background : "white", border : "0",textAlign : "start"}}>
<Accordion.Toggle variant ="none" as={Button} eventKey="0" className="p-0 m-0">
<IoIosAdd className="plusButton" style={{padding: "0" ,fontSize : "200%", color : "orange",borderRadius :"50%", border : "1px solid orange"}}/>
{'   '}<b>new classroom</b>
</Accordion.Toggle>
    </Card.Header>
  <Accordion.Collapse eventKey="0" >
  <Form className="p-3 m-0" style={{backgroundColor : "rgba(0,0,0,0.05)",border : "1px solid orange", borderRadius : "10px"}}>
   
      <Form.Label style = {{float : "left"}}>Classroom Name</Form.Label>
      <Form.Control placeholder="give a class name" name="className" value={classForm.className} onChange ={changeClassForm} />    
      <Form.Label style = {{float : "left"}}>Subject</Form.Label>
      <Form.Control placeholder="subject" name="subject" value={classForm.subject} onChange ={changeClassForm} />   
      <Form.Label style = {{float : "left"}}>Classroom Description</Form.Label>
      <Form.Control placeholder="give a short description" name="description" value={classForm.description} onChange ={changeClassForm} />    

      <div className = "p-3">

<Button variant = "success" onClick = {createClassroom} >
  {loading ? <Spinner
    as="span"
    animation="border"
    size="lg"
    role="status"
    aria-hidden="false"
  /> : "Submit" 
  }
  </Button>
      </div>
    </Form>
      </Accordion.Collapse>
      </Card>
 
</Accordion>

{
<Row className="justify-content-md-center">
    {
   classRoomArray
   }   
  </Row>  
}

    </Tab>

</Tabs>
</div>
:
<div
style={{textAlign : "center" ,position :"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}
>
<Spinner
    as="span"
    animation="grow"
    size="lg"
    role="status"
    aria-hidden="false"
  />
<p>click <a href="/"> here </a> 
to login again if taking too long</p>
</div>

}
</>
  );
}
