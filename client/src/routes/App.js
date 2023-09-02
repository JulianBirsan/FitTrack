import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Edit from './Edit';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
