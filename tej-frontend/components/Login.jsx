import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS for custom styling

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('https://tej-backend-production.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      navigate('/bilty');
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box p-4 shadow rounded">
        <h3 className="text-center mb-4">Welcome Back</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              className="form-control"
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3 mb-0">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
