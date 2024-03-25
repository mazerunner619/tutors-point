import "./App.css";
import { Navbar, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout as LOGOUT } from "./reduxStore/actions/auth";

export default function Navi() {
  const hist = useHistory();
  const { user, loading } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  async function logout(e) {
    e.preventDefault();
    dispatch(LOGOUT(hist));
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      style={{
        padding: "1%",
        background: "#EC7B12",
        letterSpacing: "5px",
        textTransform: "uppercase",
      }}
    >
      <Navbar.Brand href="/">Tutehub</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav style={{ marginLeft: "auto" }}>
          {loading === false && user && (
            <>
              {user.role === "tutor" ? (
                <LinkContainer to="/dasht">
                  <Nav.Link>
                    <FaUserCircle /> {user.name}
                  </Nav.Link>
                </LinkContainer>
              ) : (
                <LinkContainer to="/dashs">
                  <Nav.Link>
                    <FaUserCircle /> {user.name}
                  </Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/">
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </LinkContainer>
            </>
          )}

          {user === null && (
            <>
              <LinkContainer to="/">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
