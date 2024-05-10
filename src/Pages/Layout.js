import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css"
import { Container, Nav, Navbar } from "react-bootstrap";

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/evaluate">Realizar avaliação</Nav.Link>
            <Nav.Link href="/view">Visualizar avaliações</Nav.Link>
            <Nav.Link href="/export">Exportar avaliações</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
};

export default Layout;

/*
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
  }
  
  li {
    float: left;
  }
  
  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  
  li a:hover:not(.active) {
    background-color: #111;
  }
  
  .active {
    background-color: #04AA6D;
  }
  */