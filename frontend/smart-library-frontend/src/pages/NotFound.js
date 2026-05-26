
import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-body)', textAlign:'center', padding:20 }}>
      <div>
        <div style={{ fontSize:72, marginBottom:16, opacity:0.4 }}>📚</div>
        <h1 style={{ fontSize:80, fontWeight:900, color:'var(--primary)', margin:0, lineHeight:1 }}>404</h1>
        <h3 style={{ fontWeight:700, margin:'12px 0 8px' }}>Page Not Found</h3>
        <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Looks like this page checked out and never returned.</p>
        <Link to="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--primary)', color:'white', borderRadius:8, padding:'10px 20px', textDecoration:'none', marginTop:20, fontWeight:600 }}>
          <FiBookOpen /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
