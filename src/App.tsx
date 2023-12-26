import React from 'react';
import logo from './logo.svg';
import './App.css';
import SnakeComponent from './Components/Game/Snake/SnakeComponent';
import GomukuComponent from './Components/Game/Gomuku/GomukuComponent';

function App() {
  return (
    <div className="App">
      <div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </div>
      {/* <SnakeComponent/> */}
      <GomukuComponent/>
    </div>
  );
}

export default App;
