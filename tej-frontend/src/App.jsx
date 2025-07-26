// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BiltyForm from '../components/BiltyForm.jsx';
import Register from '../components/Register.jsx';
import Dashboard from '../components/Dashboard.jsx';
import Login from '../components/Login.jsx';
import CustomNavbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // optional: for global styles like page layout
import RecentUploads from '../components/RecentUploads';

function App() {
  return (
    <Router>
      <div className="page-container d-flex flex-column min-vh-100">

        {/* Optional: Top Navbar */}
        <CustomNavbar />

        {/* Page content area */}
        <main className="content-wrap flex-grow-1 p-4">
          <Routes>
            <Route path="/bilty" element={<BiltyForm />} />
            <Route path="/recent" element={<RecentUploads />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Static Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
