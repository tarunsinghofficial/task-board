import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardView } from './pages/BoardView';
import { BoardDetail } from './pages/BoardDetail';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
