import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the custom styles

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('https://tej-backend-production.up.railway.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      navigate('/login');
      alert("Registration Successful");
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-box p-4 shadow rounded">
        <h3 className="text-center mb-4">Create Account</h3>
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
          <div className="mb-3">
            <select
              name="role"
              className="form-select"
              onChange={handleChange}
              value={form.role}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
