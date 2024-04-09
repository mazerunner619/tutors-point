import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetPasswordLink } from "../reduxStore/actions/auth";

const ResetPasswordLink = ({ match }) => {
  const dispatch = useDispatch();
  const { resetting_pass, resetting_pass_error } = useSelector(
    (state) => state.authReducer
  );

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPasswordLink(email));
  };

  return (
    <div id="authPage">
      <h3>Reset Password</h3>
      <Form>
        <Form.Control
          placeholder="enter your email"
          name="email"
          value={email}
          onChange={handleChange}
          type="text"
        />
        {/* {resetting_pass_error && (
          <p className="auth-error">{resetting_pass_error?.message}</p>
        )} */}
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

export default ResetPasswordLink;
