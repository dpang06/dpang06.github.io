import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import SnakeComponent from './Components/Game/Snake/SnakeComponent';
import GomukuComponent from './Components/Game/Gomuku/GomukuComponent';
import { HomePage } from './Components/HomePage';
import Navigation from './Components/Navigation';

function App() {
  return (
    <div className="App">
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/gomuku" element={<GomukuComponent/>} />
          <Route path="/snake" element={<SnakeComponent/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
