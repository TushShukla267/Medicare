import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App';
import MultiRoleRegistrationForm from "./Creds/RegisterForm";
import MultiRoleLoginForm from "./Creds/LoginForm";
import "./index.css";
import { AuthProvider } from "./AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to register */}
          <Route path="/" element={<Navigate to="/register" />} />
          {/* Registration Page */}
          <Route
            path="/register"
            element={<MultiRoleRegistrationForm onRegisterSuccess={() => {}} />}
          />
          {/* Login Page */}
          <Route
            path="/login"
            element={<MultiRoleLoginForm onLoginSuccess={() => {}} />}
          />
          {/* ✅ Home Page */}
          <Route path="/home" element={<App />} />

          {/* Dashboard routes for all roles */}
          <Route path="/guardian-dashboard" element={<App />} />
          <Route path="/doctor-dashboard" element={<App />} />
          <Route path="/admin-dashboard" element={<App />} />
          <Route path="/patient-dashboard" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
