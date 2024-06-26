import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    role: "",
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
    info.role = e.target.name;
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
        {login_error && <p className="auth-error">{login_error?.message}</p>}
        <br />
        <Button
          style={{ display: "inline" }}
          variant="success"
          name="Tutor"
          type="submit"
          onClick={handleS}
        >
          Signin as Tutor
        </Button>{" "}
        <Button
          variant="success"
          name="Student"
          type="submit"
          onClick={handleS}
        >
          Signin as Student
        </Button>
      </Form>
      <p>
        not registered ? signup <a href="/signup">here</a>
      </p>

      <p>
        <a href="/password/reset/link">forgot password</a>
      </p>
    </div>
  );
}
