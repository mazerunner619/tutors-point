import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Button,
  Tabs,
  Tab,
  Accordion,
  Spinner,
  Form,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import MySpinner from "../Utils/Spinner";
import { LinkContainer } from "react-router-bootstrap";
import AuthContext from "../context/authContext";
import { IoIosAdd } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";

import { useHistory } from "react-router";
import { loadLoggedUser } from "../reduxStore/actions/auth";

import { sendRequest as requestSend } from "../reduxStore/actions/classroom";

export default function DashS() {
  const hist = useHistory();
  const dispatch = useDispatch();
  const { user, loading, send_request_processing } = useSelector(
    (state) => state.authReducer
  );
  const { logged, getLogged, loggedUser } = useContext(AuthContext);
  const [reRender, setRerender] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [classForm, setClassForm] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") === null &&
      localStorage.getItem("role") === null
    )
      hist.push("/");
    else if (user === null) {
      dispatch(loadLoggedUser(hist));
    }
  }, []);

  const reqArr =
    user &&
    user.requestedClasses.map((CLASS) => (
      <>
        <Col sm={10} md={6} lg={4}>
          <Card className="mx-2 my-3 p-3 classCards" bg="danger" text="white">
            <Card.Header>
              <Card.Title>{CLASS.className}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>{CLASS.description}</Card.Text>
              <div className="my-3" style={{ color: "goldenrod" }}>
                {CLASS.subject}
                <br />
                <b
                  style={{
                    fontSize: "150%",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  ! pending from tutor
                </b>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </>
    ));

  const classArr =
    user &&
    user.enrolledClasses.map((CLASS) => (
      <Col sm={10} md={5} lg={4}>
        <Card className="mx-2 my-3 p-3 classCards" bg="light">
          <LinkContainer
            to={"/classrooms/" + CLASS._id + "/" + user._id}
            style={{ cursor: "pointer" }}
          >
            <Card.Header>
              <Card.Title>{`${CLASS.className} (${CLASS.classroomID})`}</Card.Title>
            </Card.Header>
          </LinkContainer>

          <Card.Body>
            <Card.Text>{CLASS.description}</Card.Text>
            <div className="my-3" style={{ color: "goldenrod" }}>
              {/* {CLASS.pending > 0 ? (
                  <>
                    <b style={{ color: CLASS.pending > 0 ? "red" : "green" }}>
                      {CLASS.pending} assignment(s) due
                    </b>
                    <br />
                  </>
                ) : (
                  <p>no due assignments 🎉</p>
                )} */}
              {/* {CLASS.tests.length} Tests */}
              {/* <br /> */}
              {CLASS.subject}
              <br />
              {CLASS.enrolledStudents.length} Student(s)
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));

  async function sendRequest(e) {
    dispatch(requestSend(user._id, classForm));
  }

  return (
    <div>
      {user ? (
        <div id="dashboard">
          <Tabs
            style={{ fontWeight: "bolder" }}
            defaultActiveKey="#link3"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="#link3" title="My Classrooms">
              <Accordion className="m-3">
                <Card className="accor-card" style={{ border: "0" }}>
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
                      />
                      {"   "}
                      <b>join classroom</b>
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <>
                      <Form
                        className="p-3 m-0"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.05)",
                          border: "1px solid orange",
                          borderRadius: "10px",
                        }}
                      >
                        <Form.Label style={{ float: "left" }}>
                          Classroom ID
                        </Form.Label>
                        <Form.Control
                          placeholder="enter classroom id "
                          autocomplete="off"
                          name="className"
                          value={classForm}
                          onChange={(e) => setClassForm(e.target.value)}
                        />
                        <b>
                          <i>{msg}</i>
                        </b>
                        <div className="p-3">
                          <Form.Group></Form.Group>

                          {send_request_processing ? (
                            <MySpinner />
                          ) : (
                            <Button
                              variant="outline-success"
                              onClick={sendRequest}
                            >
                              "Send Request"
                            </Button>
                          )}
                        </div>
                      </Form>
                    </>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <Row className="justify-content-md-center">
                {classArr && classArr.length === 0 ? (
                  <h1
                    style={{
                      color: "grey",
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Your Enrolled Classrooms
                  </h1>
                ) : (
                  classArr
                )}
              </Row>
            </Tab>

            <Tab
              className="classroom-tabs"
              eventKey="#link1"
              title="Sent Requests"
            >
              <Row style={{ margin: "0 auto" }}>
                {reqArr && reqArr.length === 0 ? (
                  <h1
                    style={{
                      color: "grey",
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Your pending requests
                  </h1>
                ) : (
                  <Row>{reqArr}</Row>
                )}
              </Row>
            </Tab>
          </Tabs>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="false"
          />
          <p>
            click <a href="/"> here </a>
            to login again if taking too long
          </p>
        </div>
      )}
    </div>
  );
}
