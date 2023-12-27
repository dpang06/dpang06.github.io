import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, MemoryRouter } from 'react-router-dom';
import SnakeComponent from './Components/Game/Snake/SnakeComponent';
import GomukuComponent from './Components/Game/Gomuku/GomukuComponent';
import { HomePage } from './Components/HomePage';
import Navigation from './Components/Navigation';

function App() {
  return (
    <MemoryRouter basename="/">
      <div className="App">
        <Navigation />
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
