
import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, danger = false }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, padding: 28, maxWidth: 420, width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ background: danger ? '#fee2e2' : '#dbeafe', borderRadius: 8, padding: 8 }}>
            <FiAlertTriangle color={danger ? '#dc2626' : '#2563eb'} size={20} />
          </div>
          <h5 style={{ margin: 0, color: 'var(--text-primary)' }}>{title}</h5>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 16px', border: '1px solid var(--border-color)',
            borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
            background: danger ? '#dc2626' : '#2563eb', color: 'white', fontWeight: 600
          }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
