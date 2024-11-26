import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthProvider';
import RecipeProvider from './context/RecipeProvider';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <GoogleOAuthProvider clientId="1086388757530-smkdfmgk2s1vqudgodc151rijc9j594e.apps.googleusercontent.com"> {/* Wrap your app */}
      <Router>
        <AuthProvider>
          <RecipeProvider>
            <ErrorBoundary>
              <Navbar />
              <div style={{ paddingTop: '60px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <SearchForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/results"
                    element={
                      <ProtectedRoute>
                        <SearchResults />
                      </ProtectedRoute>
                    }
                  />
                  {/* Redirect all unknown routes to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
            </ErrorBoundary>
          </RecipeProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
