import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const Header = () => {
  const [activeLink, setActiveLink] = useState(null);
  const navigate = useNavigate();

  
const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");

  window.location.replace("/")
};
  const handleClick = (link) => {
    setActiveLink(link);
  };

  const linkStyle = (link) => ({
    color: activeLink === link ? "#2545B6" : "black",
    backgroundColor: activeLink === link ? "#DBE9FF" : "transparent",
    borderRadius: "8px",
    padding: "8px 12px",
    margin: "4px 6px",
    textDecoration: "none",
    fontWeight: "500",
  });

  return (
    <Navbar expand="md" bg="white" className="px-3">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto d-flex flex-wrap">
            <Link to="/admin/users" style={linkStyle("المستخدمين")} onClick={() => handleClick("المستخدمين")}>
              المستخدمين
            </Link>
            <Link to="/admin/etablissement" style={linkStyle("المؤسسة")} onClick={() => handleClick("المؤسسة")}>
              المؤسسات
            </Link>
            <Link to="/admin/professeurs" style={linkStyle("الأساتذة")} onClick={() => handleClick("الأساتذة")}>
              الأساتذة
            </Link>
            <Link to="/admin/surveillant" style={linkStyle("الحراسة")} onClick={() => handleClick("الحراسة")}>
              الحراسة
            </Link>
          </Nav>
        </Navbar.Collapse>

        <Button variant="outline-danger" onClick={handleLogout}>
          تسجيل الخروج ➝
        </Button>
      </Container>
    </Navbar>
  );
};

export default Header;
