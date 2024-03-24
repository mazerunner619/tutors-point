import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  loadLoggedUser,
  login,
} from "../reduxStore/actions/auth";

export default function Exp({ match }) {
  const { login_error, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const hist = useHistory();

  const [info, setInfo] = useState({
    email: "",
    password: "",
    as: "",
  });

  useEffect(() => {
    if (
      localStorage.getItem("role") !== null &&
      localStorage.getItem("jwtToken") !== null
    ) {
      hist.push("/dash" + localStorage.getItem("role")[1]);
    }
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
    info.as = e.target.name === "student" ? "Student" : "Tutor";
    if (info.email && info.password) {
      dispatch(login(info, hist));
    } else {
      alert("all fields are required");
    }
  }

  return (
    <div id="authPage">
      <h1>Signin</h1>
      <Form>
        <Form.Group>
          <Form.Label style={{ float: "left" }}>Email</Form.Label>
          <Form.Control
            placeholder="email"
            name="email"
            onChange={changeTutorForm}
          />

          <Form.Label style={{ float: "left" }}>Password</Form.Label>
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
        </Form.Group>
        <br />
        <p className="auth-error">
          {login_error === null ? "" : login_error.message}
        </p>
        <br />
        <Button
          style={{ display: "inline" }}
          variant="success"
          name="tutor"
          type="submit"
          onClick={handleS}
        >
          Signin as Tutor
        </Button>{" "}
        <Button
          variant="success"
          name="student"
          type="submit"
          onClick={handleS}
        >
          Signin as Student
        </Button>
        {/* <Button><a href="http://localhost:5000/auth/google">Signin with Google</a></Button> */}
      </Form>
      <p>
        not registered ? signup <a href="/signup">here</a>
      </p>
    </div>
  );
}
