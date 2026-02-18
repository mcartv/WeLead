import React, { useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import PortfolioCards from "./components/PortfolioCards";
import Planner from "./components/Planner";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import ProjectTracker from "./components/ProjectTracker";
import Layout from "./components/Layout";
import About from "./components/About";
import Contact from "./components/Contact";
import ForgotPassword from "./components/ForgotPassword";
import AdminReviewManagement from "./components/AdminReviewManagement";
import AdminPanel from "./components/AdminPanel";
import AdminPortfolioGallery from "./components/AdminPortfolioGallery";
import Settings from "./components/Settings";
import ControlPanel from "./components/ControlPanel";
import Profile from "./components/Profile";
import PaymentSchedulingForm from "./components/PaymentSchedulingForm";
import InquiryManagement from "./components/InquiryManagement";
import SchedulingManagement from "./components/SchedulingManagement";

function App() {
  const [user, setUser] = useState(null); // Logged-in user state
  const introRef = useRef(null);
  const sectionRefs = {
    portfolio: useRef(null),
    about: useRef(null),
    contact: useRef(null),
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/";
  };

  // Wrapper for protected routes
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // Wrapper for admin-only routes
  const AdminRoute = ({ children }) => {
    return user?.role === "admin" ? children : <Navigate to="/home" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Home sectionRefs={sectionRefs} introRef={introRef} user={user} />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout user={user} handleLogout={handleLogout}>
                <Outlet />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home sectionRefs={sectionRefs} introRef={introRef} user={user} />} />
          <Route path="/planner" element={<Planner user={user} handleLogout={handleLogout} />} />
          <Route path="/form" element={<Form user={user} handleLogout={handleLogout} />} />
          <Route path="/schedule-payment" element={<PaymentSchedulingForm user={user} handleLogout={handleLogout} />} />
          <Route path="/ProjectTracker" element={<ProjectTracker user={user} handleLogout={handleLogout} />} />
          <Route path="/profile" element={<Profile user={user} handleLogout={handleLogout} />} />
          <Route path="/settings" element={<Settings user={user} handleLogout={handleLogout} />} />

          {/* Admin-only routes */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard user={user} handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-review"
            element={
              <AdminRoute>
                <AdminReviewManagement user={user} handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <AdminRoute>
                <AdminPanel user={user} handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-portfolio"
            element={
              <AdminRoute>
                <AdminPortfolioGallery user={user} handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/controlpanel"
            element={
              <AdminRoute>
                <ControlPanel user={user} handleLogout={handleLogout} />
              </AdminRoute>
            }
          />
          <Route
            path="/inquiry-management"
            element={
              <AdminRoute>
                <InquiryManagement user={user} />
              </AdminRoute>
            }
          />
          {/* Add Scheduling route here */}
          <Route
            path="/scheduling"
            element={
              <AdminRoute>
                <SchedulingManagement />
              </AdminRoute>
            }
          />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;