import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import SnakeComponent from './components/Game/Snake/SnakeComponent';
import GomukuComponent from './components/Game/Gomuku/GomukuComponent';
import { HomePage } from './components/HomePage';
import { Container, Form, Nav, NavDropdown, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import TodoComponent from './components/Basic/Todo/TodoComponent';
import { useEffect, useState } from 'react';

function App() {
  const LIGHT_THEME = "light";
  const DARK_THEME = "dark";
  const [theme, setTheme] = useState(LIGHT_THEME);
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newTheme;
    if (e.currentTarget!.checked === true) {
      newTheme = DARK_THEME;
    } else {
      newTheme = LIGHT_THEME;
    }
    setTheme(newTheme);
  }
  // persist theme
  useEffect(() => {
    const initTheme = localStorage.getItem('theme') ?? LIGHT_THEME;
    setTheme(initTheme);
  }, []);
  useEffect(() => {
    localStorage.setItem('theme', theme);
  });

  return (
    <MemoryRouter basename="/">
      <Stack className="App h-100 text-secondary bg-body-tertiary" data-bs-theme={theme}>
        <Navbar expand="lg" className="bg-body-secondary">
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
            <Form>
              <Form.Check id='theme-switch-nav' className="theme-switch" type="switch" onChange={toggleTheme} checked={theme === DARK_THEME}/>
            </Form>
          </Container>
        </Navbar>
        <Container fluid>
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
        </Container>
      </Stack>
    </MemoryRouter>
  );
}

export default App;
