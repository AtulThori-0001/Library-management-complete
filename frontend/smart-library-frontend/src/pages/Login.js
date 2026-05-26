
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiBookOpen, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.usernameOrEmail || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', background: '#2563eb', borderRadius: 12, padding: '10px 12px', marginBottom: 12 }}>
            <FiBookOpen color="white" size={28} />
          </div>
          <h3 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Smart Library</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label-custom">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input name="usernameOrEmail" value={form.usernameOrEmail} onChange={handleChange}
                placeholder="Enter username or email"
                style={{ paddingLeft: 36, width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px 10px 36px', outline: 'none', fontSize: 14 }} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label-custom">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange}
                placeholder="Enter password"
                style={{ paddingLeft: 36, paddingRight: 40, width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 40px 10px 36px', outline: 'none', fontSize: 14 }} />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#2563eb', color: 'white', border: 'none',
            borderRadius: 8, padding: '11px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'all 0.15s'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: '16px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
          <strong>Demo Credentials:</strong><br />
          Admin: admin / Admin@123<br />
          Student: student1 / Student@123
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
