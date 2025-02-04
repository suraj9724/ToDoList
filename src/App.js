import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Login from './Component/Login';
import Signup from './Component/Signup';
import Home from './Component/Home';
import NoteState from './context/Notestate'
import About from './Component/About';

function App() {
  return (
    <>
      {/* NoteState Provider wraps the entire app to provide note context */}
      <NoteState>
        {/* Router setup for navigation */}
        <Router>
          {/* Navigation bar component */}
          <Navbar />
          {/* Main container for app content */}
          <div className="app-container">
            {/* Route definitions */}
            <Routes>
              {/* Home route - default landing page */}
              <Route path="/" element={<Home />} />
              {/* About page route */}
              <Route path="/about" element={<About />} />
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Alternative home route */}
              <Route path="/home" element={<Home />} />
              {/* Catch-all route - redirects to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;