import React, { useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import PortfolioCards from "./components/PortfolioCards";
import Planner from "./components/Planner";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import ProjectTracker from './components/ProjectTracker';
import Layout from "./components/Layout";
import About from "./components/About";
import Contact from "./components/Contact";
import ForgotPassword from "./components/ForgotPassword";
import AdminArea from './components/AdminArea';
import AdminReviewManagement from './components/AdminReviewManagement';
import AdminPanel from './components/AdminPanel';
import AdminPortfolioGallery from './components/AdminPortfolioGallery';
import Settings from "./components/Settings";
import ControlPanel from "./components/ControlPanel";
import Profile from "./components/Profile";

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
    window.location.href = "/"; // optional, could just navigate without reload
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
        <Route path="/guest" element={<PortfolioCards showBackToLogin={true} />} />

        {/* Protected routes with Layout */}
        <Route
          element={user ? <Layout handleLogout={handleLogout} user={user} /> : <Navigate to="/login" />}
        >
          <Route path="/home" element={<Home sectionRefs={sectionRefs} introRef={introRef} user={user} />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/form" element={<Form user={user} handleLogout={handleLogout} />} />
          <Route path="/ProjectTracker" element={<ProjectTracker user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-area" element={<AdminArea />} />

          {/* Admin-only routes */}
          <Route
            path="/dashboard"
            element={
              user?.role === "admin"
                ? <Dashboard user={user} handleLogout={handleLogout} />
                : <Navigate to="/home" />
            }
          />
          <Route
            path="/admin-review"
            element={<AdminReviewManagement user={user} handleLogout={handleLogout} />}
          />

          <Route
            path="/admin-panel"
            element={<AdminPanel user={user} handleLogout={handleLogout} />}
          />

          <Route
            path="/admin-portfolio"
            element={<AdminPortfolioGallery user={user} handleLogout={handleLogout} />}
          />

          <Route
            path="/settings"
            element={<Settings user={user} handleLogout={handleLogout} />}
          />
          
          <Route
            path="/controlpanel"
            element={
              user?.role === "admin"
                ? <ControlPanel user={user} handleLogout={handleLogout} />
                : <Navigate to="/home" />
            }
          />

          <Route
            path="/profile"
            element={<Profile user={user} handleLogout={handleLogout} />}
          />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
