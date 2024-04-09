import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../reduxStore/actions/auth";
import { useHistory } from "react-router";

const ResetPassword = ({ match }) => {
  const dispatch = useDispatch();
  const hist = useHistory();
  const { resetting_pass, resetting_pass_error } = useSelector(
    (state) => state.authReducer
  );

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    name === "p1" ? setP1(value) : setP2(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(p1, p2);
    if (p1 === p2) {
      dispatch(
        resetPassword({
          password: p1,
          token: match.params.token,
          hist,
        })
      );
    } else {
      alert("passwords don't match!");
    }
  };

  return (
    <div id="authPage">
      <h3>Reset Password</h3>
      <Form>
        <Form.Control
          placeholder="enter new password"
          name="p1"
          value={p1}
          onChange={handleChange}
          type="password"
          required
        />
        <br />

        <Form.Control
          placeholder="Confirm new password"
          name="p2"
          value={p2}
          onChange={handleChange}
          type="password"
          required
        />
        {resetting_pass_error && (
          <p className="auth-error">{resetting_pass_error?.message}</p>
        )}
        <hr />
        <Button
          disabled={resetting_pass}
          variant="success"
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
