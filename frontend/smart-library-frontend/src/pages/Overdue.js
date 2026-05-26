
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiMail } from 'react-icons/fi';
import { getOverdueTransactions } from '../services/transactionService';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

export default function Overdue() {
  const [overdues, setOverdues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverdueTransactions().then(r => setOverdues(r.data.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const totalFine = overdues.reduce((sum, t) => sum + (Math.max(0, Math.floor((today - new Date(t.dueDate))/86400000)) * 5), 0);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div><h4 style={{ fontWeight:700, margin:0 }}>Overdue Books</h4><p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>{overdues.length} books overdue · Total outstanding fine: ₹{totalFine}</p></div>
      </div>
      {loading ? <div className="spinner-center"><Spinner /></div> : overdues.length === 0 ? (
        <EmptyState icon="✅" title="No overdue books!" subtitle="All books are returned on time." />
      ) : (
        <div className="content-card">
          <table className="table-custom">
            <thead><tr><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Days Overdue</th><th>Fine (₹)</th></tr></thead>
            <tbody>
              {overdues.map(t => {
                const days = Math.max(0, Math.floor((today - new Date(t.dueDate))/86400000));
                return (
                  <tr key={t.id}>
                    <td><div style={{ fontWeight:600 }}>{t.userName}</div><div style={{ fontSize:11, color:'var(--text-secondary)' }}>{t.userEmail}</div></td>
                    <td>{t.bookTitle}</td>
                    <td>{formatDate(t.issueDate)}</td>
                    <td style={{ color:'#dc2626', fontWeight:600 }}>{formatDate(t.dueDate)}</td>
                    <td><span className="badge-custom badge-danger">{days} days</span></td>
                    <td style={{ fontWeight:700, color:'#dc2626' }}>₹{days*5}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
