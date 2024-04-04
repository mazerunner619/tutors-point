import { useState, useContext, useEffect } from "react";
import MySpinner from "../Utils/Spinner";
import {
  Modal,
  Button,
  Spinner,
  ListGroup,
  Tab,
  Table,
  Tabs,
  Form,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useHistory } from "react-router";
import { IoIosSend } from "react-icons/io";
import { FcVideoCall } from "react-icons/fc";
import { FaUserCircle } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { loadLoggedUser } from "../reduxStore/actions/auth";
import {
  loadClass,
  newComment,
  submitAssignment,
} from "../reduxStore/actions/classroom";

export default function Classroom({ match }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const {
    class_,
    class_error,
    loading: classLoading,
    upload_assignment_processing,
    upload_assignment_error,
  } = useSelector((state) => state.classReducer);
  const hist = useHistory();

  const [uploading, setUploading] = useState(false);
  const [submitFile, setSubmitFile] = useState(null);
  const [comment, setComment] = useState("");
  const [C, setC] = useState(0);

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
      hour: "numeric", // numeric, 2-digit
      minute: "numeric", // numeric, 2-digit
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

  useEffect(() => {
    if (user === null) dispatch(loadLoggedUser(hist));
    dispatch(loadClass(match.params.sid, match.params.id));
  }, []);

  async function addComment(e) {
    console.log("commenting", user._id, match.params.id);
    if (/\S/.test(comment) && !C) {
      console.log("commenting", user._id, match.params.id);
      dispatch(newComment(user._id, match.params.id, { comment, type: "1" }));
      setComment("");
    }
  }

  async function turnin(e, AID) {
    if (!submitFile) alert("please select your file to submit");
    else {
      const dummyForm = new FormData();
      dummyForm.append("assignment", submitFile);
      dispatch(submitAssignment(user._id, AID, dummyForm));
      setSubmitFile(null);
    }
  }

  const copytoclipboard = (e) => {
    navigator.clipboard.writeText(e.target.id);
    alert("copied");
  };

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

                <ListGroup as="ul" style={{ boxShadow: "2px 2px 5px black" }}>
                  <ListGroup.Item as="li" style={{ background: "#EC7B12" }}>
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
                  <ListGroup.Item as="li">{class_.subject}</ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    style={{
                      background: class_.pending > 0 ? "red" : "white",
                    }}
                  >
                    {class_.pending > 0 ? (
                      <b>{class_.pending} assignment(s) pending</b>
                    ) : (
                      <p>no pending assignments - {class_.pending}🎉</p>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item as="li">
                    <b>Enrolled : {class_.enrolledStudents.length}</b>
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
                {C ? (
                  <Spinner
                    variant="success"
                    style={{ display: "block", margin: "10px auto" }}
                    animation="border"
                    role="status"
                  />
                ) : (
                  <div
                    id="comment-button"
                    style={{ display: comment.length ? "flex" : "none" }}
                    onClick={(e) => addComment(e)}
                  >
                    <IoIosSend style={{ fontSize: "30px" }} />
                  </div>
                )}

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
              <Row style={{ margin: "0 auto" }}>
                {class_.assignments.length > 0 ? (
                  class_.assignments.map((CLASS) => (
                    <Col key={CLASS._id} sm={10} md={6} lg={4}>
                      <Card
                        key={CLASS._id}
                        className="mx-2 my-3 p-3 classCards"
                        bg="light"
                      >
                        <a
                          href={CLASS.file.fileURL || ""}
                          target="_blank"
                          rel="noreferrer"
                        >
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

                          <Form enctype="multipart/form-data">
                            {!CLASS.turned && !uploading && (
                              <Form.File
                                id="exampleFormControlFile1"
                                name="assignment"
                                onChange={(e) =>
                                  setSubmitFile(e.target.files[0])
                                }
                              />
                            )}
                          </Form>
                          <br />
                          {CLASS.turned ? (
                            <>
                              {!CLASS.evaluated ? (
                                <p style={{ color: "red" }}>
                                  not evaluated yet !
                                </p>
                              ) : (
                                <b
                                  style={{
                                    color: "green",
                                    width: "100%",
                                    padding: "3px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {CLASS.result.remarks} {CLASS.result.score}/10
                                </b>
                              )}
                            </>
                          ) : (
                            <Button
                              disabled={upload_assignment_processing}
                              type="submit"
                              onClick={(e) => turnin(e, CLASS._id)}
                            >
                              Turn in Now
                            </Button>
                          )}
                        </Card.Body>
                        <span id="dates-bottom-right">
                          {"uploaded At "}
                          {fomatDate(CLASS.createdAt)}
                        </span>
                      </Card>
                    </Col>
                  ))
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
