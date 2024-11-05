// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Default Route */}
          <Route path="/" element={<Home />} />
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Define Home and NotFound components
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <center><h1>Welcome to RecipeFit</h1>
    <p>
      <a href="/signup">Sign Up</a> | <a href="/login">Login</a>
    </p>
    </center>
  </div>
);

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Page Not Found</h2>
    <p>
      <a href="/">Go to Home</a>
    </p>
  </div>
);

export default App;
