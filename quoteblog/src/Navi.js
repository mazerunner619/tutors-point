import './App.css';
import {Navbar, Nav, Row,Spinner} from 'react-bootstrap'
import {FaUserCircle} from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react';
import AuthContext from './context/authContext';
import {LinkContainer} from 'react-router-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router';

export default function Navi() {

  const {logged, getLogged , loggedUser} = useContext(AuthContext);
  const hist = useHistory();

  async function logout(e){
    e.preventDefault();
    await axios.get('/logout');
    getLogged();
    hist.push('/');
  }

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style= 
    {{
      padding : "1%",
background: "#EC7B12",
letterSpacing : "5px",
textTransform : "uppercase",
}}>
  
<Navbar.Brand href="/">
 Tutehub
  </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
 <Nav  style = {{marginLeft : "auto"}}>

 {logged && loggedUser &&
<>{
  loggedUser.role==="tutor" ?
  <LinkContainer to="/dasht">
  <Nav.Link ><FaUserCircle />{' '}{loggedUser.name}</Nav.Link>
  </LinkContainer>
  :
  <LinkContainer to ="/dashs">
  <Nav.Link><FaUserCircle />{' '}{loggedUser.name}</Nav.Link>
  </LinkContainer>
}
<LinkContainer to = "/">
<Nav.Link onClick={logout}>Logout
</Nav.Link>
</LinkContainer>
</>
  
  }


{!logged && 
<>
    <LinkContainer to = "/">
        <Nav.Link>Login
        </Nav.Link>
    </LinkContainer>
        <LinkContainer to = "/signup">
        <Nav.Link>Signup
        </Nav.Link>
    </LinkContainer>
    </>
}

    </Nav>

  </Navbar.Collapse>

</Navbar>


  );
}
