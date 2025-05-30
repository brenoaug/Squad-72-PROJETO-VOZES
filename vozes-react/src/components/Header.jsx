import logo from "../assets/logo.svg";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Header.css";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { useState } from "react";

function Header() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark-theme", !dark);
  };

  return (
    <Navbar
      expand="lg"
      bg={dark ? "dark" : "light"}
      variant={dark ? "dark" : "light"}
    >
      <Container>
        <Navbar.Brand href="#">
          <img src={logo} alt="Logo do Projeto Vozes" width="50" height="50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvas-navbar" />
        <Navbar.Offcanvas
          id="offcanvas-navbar"
          aria-labelledby="offcanvas-navbar-label"
          placement="end"
          bg={dark ? "dark" : "light"}
          variant={dark ? "dark" : "light"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvas-navbar-label">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto">
              <Nav.Link href="#">Início</Nav.Link>
              <NavDropdown title="Ações" id="main-dropdown">
                <NavDropdown.Item href="#">Denunciar</NavDropdown.Item>
                <NavDropdown.Item href="#">Suporte</NavDropdown.Item>
                <NavDropdown.Item href="#">Acompanhamento</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Projeto</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#">Contato</Nav.Link>
              <Nav.Link href="#" className="d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>
                Login
              </Nav.Link>
              <Button
                variant={dark ? "dark" : "light"}
                className="ms-lg-3 mt-2 mt-lg-0"
                onClick={toggleTheme}
              >
                {dark ? (
                  <i className="bi bi-sun"></i>
                ) : (
                  <i className="bi bi-moon"></i>
                )}
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Header;
