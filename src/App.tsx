import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import SnakeComponent from './components/Game/Snake/SnakeComponent';
import GomukuComponent from './components/Game/Gomuku/GomukuComponent';
import { HomePage } from './components/HomePage';
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import TodoComponent from './components/Basic/Todo/TodoComponent';

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
                <NavDropdown title="Basic" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/basic/todo">TodoMatic</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Game" id="game-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/game/gomuku">Gomuku Game</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/game/snake">Snake Game</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basic/">
            <Route path="todo" element={<TodoComponent />} />
          </Route>
          <Route path="/game/">
            <Route path="gomuku" element={<GomukuComponent />} />
            <Route path="snake" element={<SnakeComponent />} />
          </Route>
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
