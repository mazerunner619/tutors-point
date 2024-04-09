import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import {
  signup,
  getCurrentUser,
  sendSignupOtp,
  verifySignupOtp,
} from "../reduxStore/actions/auth";
import { OTP_LENGTH } from "../reduxStore/actionTypes";
// import { getCookie } from "../Utils/utilFunctions";

export default function VerifySignupOtp({ match }) {
  const { loading: signingUp, signup_error } = useSelector(
    (state) => state.authReducer
  );
  const dispatch = useDispatch();
  const hist = useHistory();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // const cookie = getCookie("otpToken");
    // console.log("cookie => ", cookie);
    if (!localStorage.getItem("user-data")) {
      hist.push("/signup");
    }
  }, []);

  function handleOtpChange(e) {
    setOtp(e.target.value);
  }

  async function handleS(e) {
    e.preventDefault();
    if (otp.length === OTP_LENGTH) dispatch(verifySignupOtp(otp, hist));
  }

  return (
    <div id="authPage">
      <Form>
        <Form.Control
          placeholder="enter otp"
          name="otp"
          value={otp}
          onChange={handleOtpChange}
          maxLength={OTP_LENGTH}
          style={{ textAlign: "center", border: "0" }}
          type="text"
        />

        {signup_error && <p className="auth-error">{signup_error?.message}</p>}
        <br />
        <Button
          variant="success"
          type="submit"
          onClick={handleS}
          disabled={signingUp}
        >
          Verify OTP
        </Button>
      </Form>
      <br />
      <p>
        already have an account ? signin <a href="/">here</a>
      </p>
    </div>
  );
}
