
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBookOpen } from 'react-icons/fi';
import * as authService from '../services/authService';

const Field = ({ name, label, type = 'text', required, value, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4 }}>{label}{required && ' *'}</label>
    <input name={name} type={type} value={value} onChange={onChange} required={required}
      style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none' }} />
  </div>
);

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', studentId: '', department: '', semester: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      if (data.semester) data.semester = parseInt(data.semester);
      await authService.registerStudent(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', background: '#2563eb', borderRadius: 12, padding: '8px 10px', marginBottom: 10 }}>
            <FiBookOpen color="white" size={24} />
          </div>
          <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Create Account</h4>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Register as a student</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <Field name="firstName" label="First Name" required value={form.firstName} onChange={handleChange} />
            <Field name="lastName" label="Last Name" required value={form.lastName} onChange={handleChange} />
            <Field name="username" label="Username" required value={form.username} onChange={handleChange} />
            <Field name="email" label="Email" type="email" required value={form.email} onChange={handleChange} />
            <Field name="password" label="Password" type="password" required value={form.password} onChange={handleChange} />
            <Field name="confirmPassword" label="Confirm Password" type="password" required value={form.confirmPassword} onChange={handleChange} />
            <Field name="studentId" label="Student ID" value={form.studentId} onChange={handleChange} />
            <Field name="phone" label="Phone" value={form.phone} onChange={handleChange} />
            <Field name="department" label="Department" value={form.department} onChange={handleChange} />
            <Field name="semester" label="Semester" type="number" value={form.semester} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#2563eb', color: 'white', border: 'none',
            borderRadius: 8, padding: '11px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 8
          }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
