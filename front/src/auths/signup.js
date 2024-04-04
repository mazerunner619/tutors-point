import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { signup, getCurrentUser } from "../reduxStore/actions/auth";

export default function Exp({ match }) {
  const { user } = useSelector((state) => state.authReducer);
  const { loading, signup_error } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const hist = useHistory();
  const [confirm, setConfirm] = useState(false);
  const [info, setInfo] = useState({
    as: "",
    name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  useEffect(() => {
    if (user === null) dispatch(getCurrentUser(hist));
    else hist.push(user.role === "student" ? "/dashs" : "dasht");
  }, []);

  function changeTutorForm(e) {
    const { name, value } = e.target;
    setInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function showPass() {
    $(".pass").attr("type", "text");
  }

  function hidePass() {
    $(".pass").attr("type", "password");
  }

  async function handleS(e) {
    e.preventDefault();
    if (info.password === info.cpassword) {
      for (const key in info) {
        if (info[key] === "") {
          alert("All fields are required!");
          return;
        }
      }
      info.as = e.target.name === "student" ? "Student" : "Tutor";
      dispatch(signup(info, hist));
    } else {
      alert("passwords don't match");
    }
  }

  return (
    <div id="authPage">
      <h1>Signup</h1>

      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label style={{ float: "left" }}>Name</Form.Label>
              <Form.Control
                placeholder="Name"
                name="name"
                onChange={changeTutorForm}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label style={{ float: "left" }}>Gender</Form.Label>
            <Form.Control as="select" name="gender" onChange={changeTutorForm}>
              <option value="">select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Control>
          </Col>
          <Col>
            <Form.Label style={{ float: "left" }}>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              onChange={changeTutorForm}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label style={{ float: "left" }}>Email </Form.Label>

            <Form.Control
              placeholder="email"
              name="email"
              onChange={changeTutorForm}
            />
          </Col>

          <Col>
            <Form.Label style={{ float: "left" }}>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="phone"
              name="phone"
              onChange={changeTutorForm}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label style={{ float: "left" }}>Password </Form.Label>
            <Form.Control
              className="pass"
              type="password"
              placeholder="password"
              name="password"
              onChange={changeTutorForm}
            />
            <div
              style={{ float: "left" }}
              onMouseLeave={hidePass}
              onMouseEnter={showPass}
            >
              show password
            </div>
          </Col>

          <Col>
            <Form.Label style={{ float: "left" }}>Confirm Password</Form.Label>
            <Form.Control
              className="pass"
              type="password"
              placeholder="confirm password"
              name="cpassword"
              onChange={changeTutorForm}
            />
          </Col>
        </Row>

        <hr />

        <Form.Group>
          <Form.Check
            style={{ display: "inline", float: "left", marginRight: "20px" }}
            type="checkbox"
            name="confirm"
            label="confirm"
            onChange={() => setConfirm(!confirm)}
          />
        </Form.Group>
        <p className="auth-error">
          {signup_error === null ? "" : signup_error.message}
        </p>
        <Row>
          <Col>
            <Button
              variant="success"
              disabled={!confirm}
              name="tutor"
              type="submit"
              onClick={handleS}
            >
              Signup as Tutor
            </Button>
          </Col>
          <Col>
            <Button
              variant="success"
              disabled={!confirm}
              name="student"
              type="submit"
              onClick={handleS}
            >
              Signup as Student
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <p>
        already have an account ? signin <a href="/">here</a>
      </p>
    </div>
  );
}
