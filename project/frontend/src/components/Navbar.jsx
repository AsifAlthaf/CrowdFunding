import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isAuthenticated, 
    adminUser, 
    adminAuthenticated, 
    isAdminMode,
    logout,
    adminLogout 
  } = useAuthStore();

  const isAdminPage = location.pathname.startsWith('/admin/');

  const handleLogout = () => {
    if (isAdminMode) {
      adminLogout();
      navigate('/admin/login');
    } else {
      logout();
      navigate('/login');
    }
  };

  // Determine which user to show
  const currentUser = isAdminMode ? adminUser : user;
  const isLoggedIn = isAdminMode ? adminAuthenticated : isAuthenticated;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          StartupFund
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAdminPage ? (
              <>
                <Nav.Link as={Link} to="/campaigns">Campaigns</Nav.Link>
                {isLoggedIn && !isAdminMode && (
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/projects">Projects</Nav.Link>
                <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/admin/analytics">Analytics</Nav.Link>
                <Nav.Link as={Link} to="/admin/documents">Documents</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown title={`${currentUser?.name || 'Account'}${isAdminMode ? ' (Admin)' : ''}`} id="basic-nav-dropdown">
                {!isAdminPage && <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>}
                {!isAdminPage && !isAdminMode && <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>}
                {isAdminPage && <NavDropdown.Item as={Link} to="/admin/dashboard">Admin Dashboard</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {!isAdminPage ? (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/admin/login">Admin Login</Nav.Link>
                )}
              </>
            )}
            {/* <Button variant="outline-info" className="ms-2">
              Sample Button
            </Button> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;