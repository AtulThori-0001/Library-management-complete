
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiBook, FiUsers, FiRepeat, FiArrowDownCircle, FiArrowUpCircle,
  FiAlertCircle, FiCalendar, FiDollarSign, FiUser, FiLogOut, FiBookOpen
} from 'react-icons/fi';

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink to={to} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} onClick={onClick}>
    <Icon /> <span>{label}</span>
  </NavLink>
);

export default function Sidebar({ onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#2563eb', borderRadius: 8, padding: '6px 8px' }}>
            <FiBookOpen color="white" size={18} />
          </div>
          <div>
            <h5 style={{ margin: 0 }}>SmartLibrary</h5>
            <small>{isAdmin() ? 'Admin Portal' : 'Student Portal'}</small>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        <NavItem to="/dashboard" icon={FiGrid} label="Dashboard" onClick={onClose} />
        <NavItem to="/books" icon={FiBook} label="Books" onClick={onClose} />

        {isAdmin() && (
          <>
            <div className="nav-section-label">Management</div>
            <NavItem to="/students" icon={FiUsers} label="Students" onClick={onClose} />
            <NavItem to="/transactions" icon={FiRepeat} label="Transactions" onClick={onClose} />
            <NavItem to="/issue" icon={FiArrowDownCircle} label="Issue Book" onClick={onClose} />
            <NavItem to="/return" icon={FiArrowUpCircle} label="Return Book" onClick={onClose} />
            <NavItem to="/overdue" icon={FiAlertCircle} label="Overdue Books" onClick={onClose} />
            <NavItem to="/reservations" icon={FiCalendar} label="Reservations" onClick={onClose} />
          </>
        )}

        {!isAdmin() && (
          <>
            <div className="nav-section-label">My Library</div>
            <NavItem to="/my-books" icon={FiBookOpen} label="My Books" onClick={onClose} />
            <NavItem to="/my-reservations" icon={FiCalendar} label="My Reservations" onClick={onClose} />
            <NavItem to="/fines" icon={FiDollarSign} label="My Fines" onClick={onClose} />
          </>
        )}

        <div className="nav-section-label">Account</div>
        <NavItem to="/profile" icon={FiUser} label="Profile" onClick={onClose} />
        <button className="nav-link-custom" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={handleLogout}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#64748b' }}>
        <div style={{ fontWeight: 600, color: '#94a3b8' }}>{user?.firstName} {user?.lastName}</div>
        <div>{user?.email}</div>
      </div>
    </>
  );
}
