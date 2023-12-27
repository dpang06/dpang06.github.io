import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import SnakeComponent from './Components/Game/Snake/SnakeComponent';
import GomukuComponent from './Components/Game/Gomuku/GomukuComponent';
import { HomePage } from './Components/HomePage';
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function App() {
  return (
    <MemoryRouter basename="/">
      <div className="App">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand as={Link} to="/">Welcome!</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/gomuku">Gomuku Game</Nav.Link>
                <Nav.Link as={Link} to="/snake">Snake Game</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gomuku" element={<GomukuComponent />} />
          <Route path="/snake" element={<SnakeComponent />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
