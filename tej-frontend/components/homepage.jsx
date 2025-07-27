import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Make sure this file exists

// ✅ Image imports (adjust paths if needed)
import biltyImage from "../assets/";
import fundtransfer from "../assets/Money-transfer-icon.jpg";
import challan from "../assets/challan.png";
import sales from "../assets/invoice.jpg";
import voucher from "../assets/voucher.jpg";
import uploads from "../assets/uploads.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    document.title = "Employee Dashboard - Tej Carrier";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cards = [
    { label: "Bilty Generation", image: biltyImage, route: "/bilty" },
    { label: "Fund Transfer", image: fundtransfer, route: "/money-transfer" },
    { label: "Challan / Purchase Invoice", image: challan, route: "/challan" },
    { label: "Sales Invoice", image: sales, route: "/sales-invoice" },
    { label: "Voucher", image: voucher, route: "/voucher" },
    { label: "Other Uploads", image: uploads, route: "/uploads" },
  ];

  const getInitials = () => user?.id?.slice(0, 2).toUpperCase();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Employee Dashboard</h1>
        <div className="profile-wrapper" ref={dropdownRef}>
          <div className="emp-name">{user?.id}</div>
          <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
            {getInitials()}
          </div>
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="profile-info">👤 {user?.id}</div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.label} className="card" onClick={() => navigate(card.route)}>
            <img src={card.image} alt={card.label} className="card-image" />
            <div className="label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default homepage;
