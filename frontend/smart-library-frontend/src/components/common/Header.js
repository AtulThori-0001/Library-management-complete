
import React from 'react';
import { FiMenu, FiSun, FiMoon, FiBell } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="main-header">
      <button onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
        <FiMenu size={20} />
      </button>

      <div style={{ flex: 1 }} />

      <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 8 }}>
        {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>

      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 8 }}>
        <FiBell size={18} />
      </button>

      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: '#2563eb', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, cursor: 'pointer'
      }}>
        {getInitials(user?.firstName, user?.lastName)}
      </div>
    </div>
  );
}
