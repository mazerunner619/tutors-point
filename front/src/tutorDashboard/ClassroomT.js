import { useState, useEffect } from "react";
import {
  Button,
  Spinner,
  ListGroup,
  Tab,
  Table,
  Tabs,
  Form,
  Accordion,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import MySpinner from "../Utils/Spinner";
import { ImCross, ImCheckmark } from "react-icons/im";
import { IoIosAdd, IoIosSend } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { FcVideoCall } from "react-icons/fc";
import { LinkContainer } from "react-router-bootstrap";
import { loadLoggedUser } from "../reduxStore/actions/auth";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  addNewAssignment,
  handleRequest,
  loadClass,
  newComment,
  newMeeting,
} from "../reduxStore/actions/classroom";

export default function Classroom({ match }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const {
    request_processing,
    request_error,
    class_,
    upload_assignment_error,
    upload_assignment_processing,
    class_error,
    loading: classLoading,
  } = useSelector((state) => state.classReducer);
  const hist = useHistory();

  const [comment, setComment] = useState("");
  const [meet, setmeet] = useState({
    id: "",
    time: "",
    timeEnd: "",
    Date: new Date(),
  });

  function fomatDate(date) {
    let newDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    let currDate = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    let newTime = new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    if (newDate === currDate) return newTime;
    return `${newDate} | ${newTime}`;
  }

  function fomatDateMeet(date) {
    let newTime = new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return newTime;
  }

  const [classForm, setClassForm] = useState({
    topic: "",
    subject: "",
    description: "",
    assignment: null,
  });

  function changeClassForm(e) {
    const { name, value } = e.target;
    if (name === "assignment") {
      setClassForm({
        ...classForm,
        assignment: e.target.files[0],
      });
    } else {
      setClassForm({ ...classForm, [name]: value });
    }
  }

  useEffect(() => {
    if (user === null) dispatch(loadLoggedUser(hist));
    dispatch(loadClass(match.params.sid, match.params.id));
  }, []);

  async function addComment(e) {
    console.log("commenting", user._id, match.params.id);
    if (/\S/.test(comment)) {
      console.log("commenting", user._id, match.params.id);
      dispatch(newComment(user._id, match.params.id, { comment, type: "2" }));
      setComment("");
    }
  }

  async function scheduleMeet(e) {
    e.preventDefault();
    if (meet.id && meet.time && meet.date) {
      const newDateStart = new Date(`${meet.date}T${meet.time}:00`);
      const newDateEnd = new Date(`${meet.date}T${meet.timeEnd}:00`);
      if (
        newDateEnd.getTime() <= newDateStart.getTime() ||
        newDateStart.getTime() < Date.now()
      ) {
        alert("illogical timings! ⚠️ unfeasible");
        return;
      }
      dispatch(
        newMeeting(user._id, match.params.id, {
          link: meet.id,
          timing: newDateStart,
          ending: newDateEnd,
        })
      );
      setmeet({
        id: "",
        time: "",
        timeEnd: "",
        date: new Date(),
      });
    } else alert("all fields are required!");
  }
  const copytoclipboard = (e) => {
    navigator.clipboard.writeText(e.target.id);
    alert("copied");
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    const dummyForm = new FormData();
    dummyForm.append("assignment", classForm.assignment);
    dummyForm.append("topic", classForm.topic);
    dummyForm.append("subject", classForm.subject);
    dummyForm.append("description", classForm.description);
    console.log(classForm);
    dispatch(addNewAssignment(match.params.id, user._id, dummyForm));
  };

  const acceptRequest = async (e, SID) => {
    dispatch(handleRequest(match.params.id, SID, "accept"));
  };

  const rejectRequest = async (e, SID) => {
    dispatch(handleRequest(match.params.id, SID, "reject"));
  };

  const reqArr =
    class_ &&
    class_.studentRequests.map((cr) => (
      <>
        <li>
          <p style={{ display: "inline", float: "left" }}>{cr.name}</p>
          <div style={{ float: "right" }}>
            {request_processing ? (
              <MySpinner />
            ) : (
              <>
                <Button
                  onClick={(e) => acceptRequest(e, cr._id)}
                  variant="success"
                  style={{ marginRight: "5px" }}
                >
                  <ImCheckmark />
                </Button>

                <Button
                  onClick={(e) => rejectRequest(e, cr._id)}
                  variant="danger"
                >
                  <ImCross />
                </Button>
              </>
            )}
          </div>
        </li>
        <p className="auth-error">
          {request_error === null ? "" : request_error.message}
        </p>
        <br />
      </>
    ));

  const assignmentArr =
    class_ &&
    class_.assignments.map((CLASS) => (
      <Col sm={10} md={6} lg={4}>
        <Card className="mx-2 my-3 p-3 classCards" bg="light">
          <a href={CLASS.file.fileURL || ""} target="_blank" rel="noreferrer">
            <Card.Img
              variant="top"
              src={CLASS.file.fileURL || ""}
              width="100%"
              height="150px"
            />
          </a>
          <Card.Body>
            <Card.Title>
              {CLASS.topic}
              <br />
              {CLASS.subject}
            </Card.Title>

            <Card.Text>{CLASS.description}</Card.Text>
            <div className="my-3" style={{ color: "goldenrod" }}>
              {class_.enrolledStudents.length - CLASS.doneby.length > 0 ? (
                <>
                  <b> {class_.enrolledStudents.length - CLASS.doneby.length}</b>{" "}
                  submission(s) remaining
                  <br />
                </>
              ) : (
                <b>turned in by All</b>
              )}
            </div>
            <LinkContainer
              to={"/assignment/" + CLASS._id}
              style={{ cursor: "pointer" }}
            >
              <Button variant="primary">Open</Button>
            </LinkContainer>
          </Card.Body>
          <span id="dates-bottom-right">{fomatDate(CLASS.createdAt)}</span>
        </Card>
      </Col>
    ));

  return (
    <div style={{ background: "#8EE4AF", minHeight: "100vh", marginTop: "0" }}>
      {classLoading === false && class_ ? (
        <>
          <Tabs
            defaultActiveKey="classroom"
            id="uncontrolled-tab-example"
            className="m-3 p-3"
          >
            <Tab
              className="classroom-tabs"
              eventKey="classroom"
              title="Summary"
            >
              <>
                {class_.meeting && class_.meeting.link && (
                  <>
                    <Button id="meet-button">
                      <a
                        href={class_.meeting.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FcVideoCall style={{ fontSize: "larger" }} />
                      </a>
                    </Button>
                    <div style={{ textAlign: "center" }}>
                      <i>{fomatDateMeet(class_.meeting.timing)}</i>
                    </div>
                  </>
                )}
                <Accordion className="m-3">
                  <Card
                    className="accor-card"
                    id="background-green"
                    style={{ border: "0" }}
                  >
                    <Card.Header
                      style={{
                        background: "white",
                        border: "0",
                        textAlign: "start",
                      }}
                    >
                      <Accordion.Toggle
                        variant="none"
                        as={Button}
                        eventKey="0"
                        className="p-0 m-0"
                      >
                        <IoIosAdd
                          className="plusButton"
                          style={{
                            padding: "0",
                            fontSize: "200%",
                            background: "orange",
                            color: "white",
                            borderRadius: "50%",
                            border: "1px solid orange",
                          }}
                        />{" "}
                        <b>Schedule Meeting</b>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <>
                        <Form
                          enctype="multipart/form-data"
                          className="p-3 m-0"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.05)",
                            border: "1px solid orange",
                            borderRadius: "10px",
                          }}
                        >
                          <Form.Label style={{ float: "left" }}>
                            Meeting Link
                          </Form.Label>

                          <Form.Control
                            required
                            name="meet-id"
                            value={meet.id}
                            onChange={(e) =>
                              setmeet((prev) => {
                                return { ...prev, id: e.target.value };
                              })
                            }
                          />
                          <Form.Label style={{ float: "left" }}>
                            Date
                          </Form.Label>
                          <Form.Control
                            required
                            type="date"
                            name="meet-date"
                            value={meet.date}
                            onChange={(e) =>
                              setmeet((prev) => {
                                return { ...prev, date: e.target.value };
                              })
                            }
                          />

                          <Form.Label style={{ float: "left" }}>
                            Start Time
                          </Form.Label>
                          <Form.Control
                            required
                            type="time"
                            name="meet-time-start"
                            value={meet.time}
                            onChange={(e) =>
                              setmeet((prev) => {
                                return { ...prev, time: e.target.value };
                              })
                            }
                          />

                          <Form.Label style={{ float: "left" }}>
                            End Time
                          </Form.Label>
                          <Form.Control
                            required
                            type="time"
                            name="meet-timeEnd"
                            value={meet.timeEnd}
                            onChange={(e) =>
                              setmeet((prev) => {
                                return { ...prev, timeEnd: e.target.value };
                              })
                            }
                          />
                          <br />
                          <div className="p-3">
                            <Button
                              variant="success"
                              onClick={(e) => scheduleMeet(e)}
                            >
                              Schedule Meet
                            </Button>
                          </div>
                        </Form>
                      </>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <ListGroup as="ul" style={{ boxShadow: "2px 2px 5px black" }}>
                  <ListGroup.Item
                    key="1"
                    as="li"
                    style={{ background: "#EC7B12" }}
                  >
                    {class_.className}
                    <p style={{ display: "inline", float: "right" }}>
                      <b>Classroom ID</b>
                      {" : "}
                      <MdContentCopy
                        id={class_.classroomID}
                        onClick={(e) => copytoclipboard(e)}
                      />
                      {class_.classroomID}
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item key="2" as="li">
                    {class_.subject}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    <b>Assignments : {class_.assignments.length}</b>
                  </ListGroup.Item>
                  <ListGroup.Item key="3" as="li">
                    <b>Enrolled : {class_.enrolledStudents.length}</b>
                  </ListGroup.Item>
                  <ListGroup.Item key="4" as="li">
                    <b>Requests : {class_.studentRequests.length}</b>
                    <ul>{reqArr}</ul>
                    <p className="auth-error">
                      {class_error === null ? "" : class_error.message}
                    </p>
                  </ListGroup.Item>
                </ListGroup>
                <div id="class-comment">Comment Section</div>
                <Form id="class-comment-form">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="add a comment ..."
                    name="description"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form>
                <div
                  id="comment-button"
                  style={{ display: comment.length ? "flex" : "none" }}
                  onClick={(e) => addComment(e)}
                >
                  <IoIosSend style={{ fontSize: "30px" }} />
                </div>

                {class_.comments
                  .slice()
                  .reverse()
                  .map((comment) => (
                    <Card id="comment-card">
                      <ListGroup.Item>
                        <div id="commentor-name">
                          <FaUserCircle />{" "}
                          {comment.by === "1"
                            ? comment.byStudent.name
                            : comment.byTutor.name}
                        </div>
                        <div id="commentor-date">{fomatDate(comment.date)}</div>
                        <br />
                        <div id="comment">{comment.comment}</div>
                      </ListGroup.Item>
                    </Card>
                  ))}
              </>
            </Tab>

            <Tab eventKey="assignment" title="Assignments">
              <Accordion className="m-3" style={{ background: "#EC7B12" }}>
                <Card
                  className="accor-card"
                  id="background-green"
                  style={{ border: "0" }}
                >
                  <Card.Header
                    style={{
                      background: "white",
                      border: "0",
                      textAlign: "start",
                    }}
                  >
                    <Accordion.Toggle
                      variant="none"
                      as={Button}
                      eventKey="0"
                      className="p-0 m-0"
                    >
                      <IoIosAdd
                        className="plusButton"
                        style={{
                          padding: "0",
                          fontSize: "200%",
                          background: "orange",
                          color: "white",
                          borderRadius: "50%",
                          border: "1px solid orange",
                        }}
                      />{" "}
                      <b>new assignment</b>
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <>
                      <Form
                        enctype="multipart/form-data"
                        className="p-3 m-0"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.05)",
                          border: "1px solid orange",
                          borderRadius: "10px",
                        }}
                      >
                        <h4 atyle={{ textAlign: "center" }}>
                          Upload New Assignment
                        </h4>
                        <Form.Label style={{ float: "left" }}>Topic</Form.Label>
                        <Form.Control
                          placeholder="topic"
                          name="topic"
                          value={classForm.topic}
                          onChange={changeClassForm}
                        />
                        <Form.Label style={{ float: "left" }}>
                          Chapter
                        </Form.Label>
                        <Form.Control
                          placeholder="chapter"
                          name="subject"
                          value={classForm.subject}
                          onChange={changeClassForm}
                        />
                        <Form.Label style={{ float: "left" }}>
                          Description
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="give a short description"
                          name="description"
                          value={classForm.description}
                          onChange={changeClassForm}
                        />
                        <br />
                        <Form.File
                          id="exampleFormControlFile1"
                          name="assignment"
                          onChange={changeClassForm}
                        />

                        <div className="p-3">
                          {upload_assignment_processing ? (
                            <MySpinner />
                          ) : (
                            <Button
                              variant="success"
                              onClick={createAssignment}
                            >
                              Submit
                            </Button>
                          )}
                        </div>
                        <p className="auth-error">
                          {upload_assignment_error
                            ? upload_assignment_error.message
                            : ""}
                        </p>
                      </Form>
                    </>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <Row style={{ margin: "0 auto" }}>
                {assignmentArr.length > 0 ? (
                  assignmentArr
                ) : (
                  <h2> no Assignments in this class ! </h2>
                )}
              </Row>
            </Tab>
            <Tab
              className=".classroom-tabs"
              eventKey="students"
              title="Students"
            >
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {class_.enrolledStudents.map((cr) => (
                    <tr>
                      <td>{cr.name}</td>
                      <td>{cr.email}</td>
                      <td>{cr.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </>
      ) : (
        <>
          {class_error === null ? (
            <Spinner
              variant="danger"
              style={{ position: "absolute", left: "50%", top: "50%" }}
              animation="grow"
              role="status"
            >
              {" "}
            </Spinner>
          ) : (
            <p className="auth-error">
              {class_error === null ? "" : class_error.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}
