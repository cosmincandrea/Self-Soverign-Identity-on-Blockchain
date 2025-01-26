import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import IssuerPage from './routes/IssuerPage';
import HolderPage from './routes/HolderPage';
import HomePage from './routes/HomePage';
import InstitutionsPage from './routes/InstitutionsPage';

function App() {
  return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/issuer" element={<IssuerPage />} />
                  <Route path="/holder" element={<HolderPage />} />
                  <Route path="/institutions" element={<InstitutionsPage />} />
                  <Route path="/" element={<HomePage />} /> 
              </Routes>
          </Router>
      </AuthProvider>
  );
}

export default App;
