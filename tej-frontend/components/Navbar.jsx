import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './navbar.css';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Tej Carrier Pvt Ltd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <NavDropdown title="Bilty" id="bilty-dropdown">
              <NavDropdown.Item as={Link} to="/bilty">Create Bilty</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/recent">Recent Uploads</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
