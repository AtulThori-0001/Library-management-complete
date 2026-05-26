
import React from 'react';
export default function Spinner({ size = 32 }) {
  return (
    <div style={{ display: 'inline-block', width: size, height: size,
      border: '3px solid var(--border-color)',
      borderTopColor: 'var(--primary)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }} />
  );
}
// Add animation to global CSS
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
if (!document.head.querySelector('[data-spin]')) {
  style.setAttribute('data-spin', '');
  document.head.appendChild(style);
}
