import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer bg-dark text-white py-2 text-center">
      <small>© {new Date().getFullYear()} iexe Technologies. All rights reserved.</small>
    </footer>
  );
};

export default Footer;
