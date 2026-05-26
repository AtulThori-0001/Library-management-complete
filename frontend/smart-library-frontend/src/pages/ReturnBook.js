
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiArrowUpCircle } from 'react-icons/fi';
import { getActiveIssues, returnBook } from '../services/transactionService';
import { formatDate } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

export default function ReturnBook() {
  const [search, setSearch] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(null);
  const [waiveFine, setWaiveFine] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try { const r = await getActiveIssues(0, 50); setIssues(r.data.data.content.filter(t => !search || t.userName.toLowerCase().includes(search.toLowerCase()) || t.bookTitle.toLowerCase().includes(search.toLowerCase()))); }
    catch { toast.error('Failed to load'); }
    setLoading(false);
  };

  const handleReturn = async (t) => {
    setLoading(true);
    try {
      const r = await returnBook({ transactionId: t.id, waiveFine, remarks });
      setResult(r.data.data);
      setIssues(prev => prev.filter(i => i.id !== t.id));
      toast.success('Book returned!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Return failed'); }
    setLoading(false);
  };

  const today = new Date();

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>Return Book</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Process book returns and calculate fines</p>
      </div>
      <div className="content-card" style={{ padding:24, marginBottom:20, maxWidth:900 }}>
        <div style={{ display:'flex', gap:8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSearch()} placeholder="Search by student name or book title..."
            style={{ flex:1, border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
          <button onClick={handleSearch} className="btn-primary-custom"><FiSearch /> Search Active Issues</button>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, cursor:'pointer', fontSize:14 }}>
          <input type="checkbox" checked={waiveFine} onChange={e => setWaiveFine(e.target.checked)} />
          Waive fine for this return
        </label>
      </div>

      {loading ? <div className="spinner-center"><Spinner /></div> : issues.length > 0 && (
        <div className="content-card">
          <table className="table-custom">
            <thead><tr><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Days Overdue</th><th>Fine</th><th>Action</th></tr></thead>
            <tbody>
              {issues.map(t => {
                const overdueDays = Math.max(0, Math.floor((today - new Date(t.dueDate)) / 86400000));
                const fine = waiveFine ? 0 : overdueDays * 5;
                return (
                  <tr key={t.id}>
                    <td><strong>{t.userName}</strong></td>
                    <td>{t.bookTitle}</td>
                    <td>{formatDate(t.issueDate)}</td>
                    <td style={{ color: overdueDays>0 ? '#dc2626' : 'inherit', fontWeight: overdueDays>0 ? 600 : 'normal' }}>{formatDate(t.dueDate)}</td>
                    <td>{overdueDays > 0 ? <span className="badge-custom badge-danger">{overdueDays} days</span> : <span className="badge-custom badge-success">On time</span>}</td>
                    <td style={{ fontWeight:700, color: fine>0 ? '#dc2626' : '#166534' }}>₹{fine}</td>
                    <td><button onClick={() => handleReturn(t)} className="btn-primary-custom" style={{ fontSize:12, padding:'6px 12px' }}><FiArrowUpCircle /> Return</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="content-card" style={{ padding:24, marginTop:20, background:'#dcfce7', border:'1px solid #86efac' }}>
          <h6 style={{ fontWeight:700, color:'#166534' }}>✓ Book Returned Successfully!</h6>
          <p style={{ fontSize:13, color:'#166534', marginTop:4 }}>Book: {result.bookTitle} · Fine: ₹{result.fineAmount || 0}</p>
        </div>
      )}
    </div>
  );
}
