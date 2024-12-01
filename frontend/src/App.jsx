import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import RecipeProvider from './context/RecipeProvider';
import ErrorBoundary from './components/ErrorBoundary';
<<<<<<< HEAD
import AuthSuccess from './components/AuthSuccess';
import UploadRecipe from './components/UploadRecipe';
import RecipeDetails from './components/RecipeDetails'; // Add RecipeDetails component
=======
import UploadRecipe from './components/UploadRecipe'
import RecipeDetails from './components/RecipeDetails';
>>>>>>> main

function App() {
  return (
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
<<<<<<< HEAD
                <Route path="/auth/success" element={<AuthSuccess />} />
=======
>>>>>>> main
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <UploadRecipe />
                    </ProtectedRoute>
                  }
                />
<<<<<<< HEAD
                {/* Add the RecipeDetails route */}
                <Route
                  path="/recipes/:id"
                  element={
                    <ProtectedRoute>
                      <RecipeDetails />
                    </ProtectedRoute>
                  }
                />
=======
                <Route
                  path="/recipes/:id" // Add this route
                  element={
                    <ProtectedRoute>
                      <RecipeDetails /> {/* Use the RecipeDetails component */}
                    </ProtectedRoute>
                  }
                />
                {/* Redirect all unknown routes to Home */}
>>>>>>> main
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
