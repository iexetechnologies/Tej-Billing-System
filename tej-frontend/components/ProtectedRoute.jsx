import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const CORRECT_USERNAME = 'admin';      // Set your username
const CORRECT_PASSWORD = 'pass123'; // Set your password

const ProtectedRoute = ({ children }) => {
  const [entered, setEntered] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      setEntered(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  if (!entered) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login to Access the Page!!</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </label>
          </div>
          <div style={{ marginTop: 10 }}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </label>
          </div>
          <button type="submit" style={{ marginTop: 15 }}>Login</button>
        </form>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;