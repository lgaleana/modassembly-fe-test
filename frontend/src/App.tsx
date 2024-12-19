import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InputView from './views/input/InputView';
import GraphView from './views/graph/GraphView';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/input" replace />} />
        <Route path="/input" element={<InputView />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </Router>
  );
}

export default App;
