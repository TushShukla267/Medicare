import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App.tsx';
import MultiRoleRegistrationForm from "./RegisterForm.tsx";
import MultiRoleLoginForm from "./LoginForm.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
