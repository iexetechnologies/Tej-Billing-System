import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // ← Add this line to apply custom styles

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://tej-backend-production.up.railway.app/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data);
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return user ? (
    <div className="dashboard-container d-flex justify-content-center align-items-center">
      <div className="dashboard-box p-4 shadow rounded text-center">
        <h3 className="mb-3">Welcome, {user.name}!</h3>
        <p className="mb-3">Role: <strong>{user.role}</strong></p>
        <button className="btn btn-danger w-100" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="dashboard-container d-flex justify-content-center align-items-center">
      <div className="dashboard-box text-center">
        <p>Loading...</p>
      </div>
    </div>
  );
}
