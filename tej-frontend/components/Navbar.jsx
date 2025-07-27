import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './navbar.css';

const CustomNavbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Tej Carrier Pvt Ltd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {/* ✅ New Dropdown for Managing Master Data */}
            <NavDropdown title="Dashboard" id="manage-dropdown">
              <NavDropdown.Item as={Link} to="/add-location">Add Location</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-consignee">Add Consignee</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-vehicle-type">Add Vehicle Type</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Bilty" id="bilty-dropdown">
              <NavDropdown.Item as={Link} to="/bilty">Create Bilty</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/recent">Recent Uploads</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Fund Transfer" id="Fund-transfer">
              <NavDropdown.Item as={Link} to="/">Add Account no</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/">Add</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/challan">Challan</Nav.Link>
            <Nav.Link as={Link} to="/voucher">Voucher</Nav.Link>
            <Nav.Link as={Link} to="/bill">Bill</Nav.Link>
            <Nav.Link as={Link} to="/other-uploads">Other Uploads</Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Item className="mt-2 text-light">
              👤User : <strong>{username || 'Guest'}</strong>
            </Nav.Item>
            <button
  onClick={() => {
    localStorage.removeItem('isAuthenticated');
    window.location.reload(); // or use navigation to redirect
  }}
  style={{ marginLeft: 10 , width: '100px', height: '30px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}
>
  Logout
</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
