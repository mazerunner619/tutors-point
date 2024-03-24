import { Spinner } from "react-bootstrap";
const MySpinner = ({ variant }) => (
  <Spinner
    variant={variant || "success"}
    style={{ display: "block", margin: "10px auto" }}
    animation="border"
    role="status"
  />
);

export default MySpinner;
