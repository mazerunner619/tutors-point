import { useState , useContext, useEffect} from 'react';
import {Modal, Button ,Spinner,ListGroup, Tab ,Table, Tabs, Form,Accordion,Card, Row, Col} from 'react-bootstrap'
import axios from 'axios';
import { useHistory } from 'react-router';
import AuthContext from '../context/authContext';
import {ImCross,ImCheckmark, ImCopy} from 'react-icons/im'
import {IoIosSend} from 'react-icons/io'
import {FcVideoCall} from 'react-icons/fc'
import {FaUserCircle} from 'react-icons/fa'

import {MdContentCopy} from 'react-icons/md'

export default function Classroom({match}) {

    const {logged, getLogged, loggedUser} = useContext(AuthContext);
    const [classData, setClassData] = useState({});
    const [classA, setClassA] = useState([]);
    const [classS, setClassS] = useState([]);
    const [classC, setClassC] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitFile, setSubmitFile] = useState(null);
    const [comment, setComment] = useState("");
    const [C, setC] = useState(0);


    function fomatDate(date){
      let newDate = new Date(date).toLocaleDateString("en-US", {weekday : "short", month : "short", day : "numeric"});
      let currDate = new Date().toLocaleDateString("en-US", {weekday : "short", month : "short", day : "numeric"});
      let newTime = new Date(date).toLocaleString('en-US', {
        hour: 'numeric', // numeric, 2-digit
        minute: 'numeric', // numeric, 2-digit
    });
      if(newDate === currDate)
      return newTime;
      return `${newDate} | ${newTime}`;
    }

    function fomatDateMeet(date){
      let newTime = new Date(date).toLocaleString('en-US',
      {weekday : "short", month : "short", day : "numeric",   hour: 'numeric',minute: 'numeric'}
      );
      return newTime;
    }

    useEffect(()=>{

        const getClass = async()=>{
            setLoading(true);
            console.log('paramsid : ', match.params.sid, match.params.id);
            const {data} = await axios.get(`/auth/student/${match.params.sid}/classroom/${match.params.id}`);
            console.log('data',data);
            setClassData(data.classInfo);
            setClassS(data.enrolledStudents);
            setClassA(data.assignments);
            setLoading(false);
        }
        getClass();
      }, []);



useEffect( () => {
  const getComments = async() => {
    const {data} = await axios.post(`/auth/${loggedUser._id}/comment/${match.params.id}`, {comment, type : ''});
    setClassC(data);
  } 
  getComments();
}, []);




async function addComment(e){
  if (/\S/.test(comment) && !C) {
    setC(1);
    const {data} = await axios.post(`/auth/${loggedUser._id}/comment/${match.params.id}`, {comment, type : '1'});
    setComment("");
    setClassC(data);
    setC(0);
  }
}

async function turnin(e, AID){
  if(!submitFile)alert('please select your file to submit');
  else{
  setUploading(true);
  const dummyForm = new FormData();
  dummyForm.append('assignment',submitFile);
  let {data} = await axios.post(`/auth/${loggedUser._id}/assignment/${AID}/submit`, dummyForm);
  setUploading(false);
  // alert('submitted !');
  let ref = await axios.get(`/auth/student/${match.params.sid}/refreshassignments/${match.params.id}`);
  // console.log(ref.data);
  setClassA(ref.data);
  }
}


    const copytoclipboard = (e)=>{
        navigator.clipboard.writeText(e.target.id);
          alert('copied');
    }

return (
  <div style={{background : "#8EE4AF" , minHeight : "100vh", marginTop : "0"}}>
    
        {
            loading ? <Spinner variant = "danger" style={{position : "absolute", left : "50%", top :"50%"}} animation="grow" role="status"></Spinner>
          :
          <>
<Tabs defaultActiveKey="classroom" id="uncontrolled-tab-example" className="m-3 p-3">
  <Tab className="classroom-tabs" eventKey="classroom" title="Summary">
        <>
        {
          classData.meeting && classData.meeting.link && 
        <>
        <Button id = "meet-button">
        <a href = {classData.meeting.link} target = "_blank" rel = "noreferrer">
          <FcVideoCall style={{fontSize : "larger"}}/>
          </a>
        </Button>
        <div style={{textAlign : "center"}}>
          <i>{fomatDateMeet(classData.meeting.timing)}</i>
        </div>
        </>
}

        <ListGroup as="ul" style={{boxShadow: "2px 2px 5px black"}}>
    <ListGroup.Item as="li" style={{background : "#EC7B12"}}>{classData.className}<p style={{display : "inline", float : "right"}}><b>Classroom ID</b>{' : '}<MdContentCopy id={classData.classroomID} onClick = {(e)=>copytoclipboard(e)}/>{classData.classroomID}</p></ListGroup.Item>
    <ListGroup.Item as="li" >{classData.subject}</ListGroup.Item>
    <ListGroup.Item as="li" style={{background : classData.pending > 0 ?"red" : "white"}}>
      { 
        classData.pending>0 ? 
      <b >{classData.pending} assignment(s) pending</b>
      :
      <p>no pending assignments 🎉</p>
      }
      </ListGroup.Item>
    <ListGroup.Item as="li"><b>Enrolled : {classS.length}</b></ListGroup.Item>
    </ListGroup>
    <div id = "class-comment">Comment Section</div>
    <Form id = "class-comment-form">
      <Form.Control as="textarea" rows={3} placeholder="add a comment ..." name="description" value={comment} onChange ={ (e) => setComment(e.target.value)}/>   
          </Form>
          {
            C ?
    <Spinner variant = "success" style={{display : "block", margin : "10px auto"}} animation="border" role="status" />
            :          
      <div id = "comment-button" style={{display : (comment.length)?"flex":"none"}} onClick={(e)=>addComment(e)}><IoIosSend style={{fontSize : "30px"}}/></div>
          }

          {
              classC.map( comment => 
              <Card id= "comment-card">  
                <ListGroup.Item><div id="commentor-name"><FaUserCircle /> {' '}{comment.by === '1' ? comment.byStudent.name : comment.byTutor.name}</div><div id ="commentor-date">{fomatDate(comment.date)}</div><br/><div id="comment">{comment.comment}</div></ListGroup.Item>
              </Card>
              )
          }

  </>

</Tab>

  <Tab eventKey="assignment" title="Assignments">

<Row style={{ margin : "0 auto"}}>
      {
      classA.length>0 ?
      classA.map( CLASS => 
        <Col sm={10} md={6} lg={4}>
        <Card className="mx-2 my-3 p-3 classCards" bg="light">
            <a href={CLASS.file.fileURL} target="_blank" rel="noreferrer"><Card.Img variant="top" src={CLASS.file.fileURL} width = "100%" height = "150px"/></a>
        <Card.Body>
        <Card.Title>{CLASS.topic}<br/>
        {CLASS.subject}</Card.Title>
      
            <Card.Text>
           {CLASS.description}
            </Card.Text>
            
            <Form enctype="multipart/form-data" >
              {
                !CLASS.turned && !uploading &&
                <Form.File id="exampleFormControlFile1" name="assignment" onChange={(e)=>setSubmitFile(e.target.files[0])}/>        
              }
              </Form>
            <br/>
            {
              CLASS.turned ?
              <>
              
                {
                !CLASS.evaluated ? <p style={{color : "red"}}>not evaluated yet !</p> : 
                <b style = {{color : "green", width : "100%", padding : "3px", borderRadius : "4px"}}>
                    {CLASS.result.remarks}{' '}{CLASS.result.score}/10
                </b>
              }

              </>

                :
                
                <Button
                disabled = {uploading}
                type="submit" onClick={(e)=>turnin
                  (e, CLASS._id)}>

                  {uploading?"turning in ..." : "Turn in Now"}
                  </Button>  
            }
        </Card.Body>
  <span id = "dates-bottom-right">{'uploaded At '}{fomatDate(CLASS.createdAt)}</span>
        </Card>
        </Col>
      )
       : <h2> no Assignments in this class ! </h2>
}
  </Row>

  </Tab>


  <Tab className=".classroom-tabs" eventKey="students" title="Students">
  <Table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
    </tr>
  </thead>
  <tbody>
  {  classS.map(cr=>
    <tr>
      <td>{cr.name}</td>
      <td>{cr.email}</td>
      <td>{cr.phone}</td>
    </tr>)}
  </tbody>
</Table>

  </Tab>

</Tabs>  
</>    

}
    </div>

);

  }