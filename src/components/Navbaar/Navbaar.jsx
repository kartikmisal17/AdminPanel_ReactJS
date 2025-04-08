import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbaar.css';


// import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';


function Navbaar() {
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // ✅ Remove Authentication
    navigate("/"); // 🔄 Redirect to Login Page
  };
  function home(){
    navigate('/home') 
  }
  function orders(){
    navigate('/orders') 
  }
 
  function menucard(){
    navigate('/menucrd') 
  }
  function menu(){
    navigate('/menu') 
  }
  function fcat(){
    navigate('/fcat') 
  }
  function fqty(){
    navigate('/Fqty') 
  }

  return (
    <Navbar
    expand="lg"
    className="bg-body-tertiary"
    style={{
      position: 'sticky',   // Make the navbar sticky
      top: 0,               // Keep the navbar at the top
      zIndex: 1000,         // Ensure the navbar is above other content
      width: '100%',        // Ensure it spans the full width
    }}
  >
      <Container fluid>
        <Navbar.Brand href="" onClick={home}>Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0"style={{ maxHeight: '100px' }}navbarScroll  >
            <Nav.Link href="#" onClick={home}>Home</Nav.Link>
            <Nav.Link href="#" onClick={orders}>Orders</Nav.Link>
            <Nav.Link href="#" onClick={menucard}>Menu Card</Nav.Link>
            <Nav.Link href="#" onClick={menu}>Menu </Nav.Link>
            <Nav.Link href="#" onClick={fcat}>Food Category</Nav.Link>
            <Nav.Link href="#" onClick={fqty}>Food Quantity</Nav.Link>           
          </Nav>
          <Form className="d-flex">
            <Button variant="outline-success" onClick={handleLogout}>Logout</Button> {/* 🔘 Logout Button */}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbaar;