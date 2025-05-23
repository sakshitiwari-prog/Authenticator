import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './Pages/SignIn';
import VerifyOtp from './Pages/VerifyOtp';
import Home from './Pages/Home';
import PublicRouteWrapper from './Authenticator/PublicRouteWrapper';
import ProtectedRouteWrapper from './Authenticator/ProtectedRouteWrapper';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRouteWrapper>
              <Home />
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRouteWrapper>
              <SignIn />
            </PublicRouteWrapper>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRouteWrapper>
              <VerifyOtp />
            </PublicRouteWrapper>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
