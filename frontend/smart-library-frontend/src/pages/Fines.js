
import React, { useEffect, useState } from 'react';
import { getMyBooks } from '../services/transactionService';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';

export default function Fines() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    getMyBooks().then(r => {
      const overdue = (r.data.data || []).filter(t => new Date(t.dueDate) < today);
      setBooks(overdue);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const totalFine = books.reduce((s, t) => s + Math.max(0, Math.floor((today - new Date(t.dueDate))/86400000))*5, 0);

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>My Fines</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Outstanding fine: <strong style={{ color:'#dc2626' }}>₹{totalFine}</strong></p>
      </div>
      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : books.length === 0 ? <EmptyState icon="✅" title="No outstanding fines!" subtitle="All your books are returned on time." /> : (
          <table className="table-custom">
            <thead><tr><th>Book</th><th>Due Date</th><th>Days Overdue</th><th>Fine (₹/day)</th><th>Total Fine</th></tr></thead>
            <tbody>
              {books.map(t => {
                const days = Math.max(0, Math.floor((today - new Date(t.dueDate))/86400000));
                return (
                  <tr key={t.id}>
                    <td><strong>{t.bookTitle}</strong></td>
                    <td style={{ color:'#dc2626', fontWeight:600 }}>{formatDate(t.dueDate)}</td>
                    <td><span className="badge-custom badge-danger">{days} days</span></td>
                    <td>₹5/day</td>
                    <td style={{ fontWeight:700, color:'#dc2626' }}>₹{days*5}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background:'#fee2e2' }}>
                <td colSpan={4} style={{ padding:'12px 14px', fontWeight:700, textAlign:'right' }}>Total Outstanding Fine:</td>
                <td style={{ padding:'12px 14px', fontWeight:800, color:'#dc2626', fontSize:16 }}>₹{totalFine}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
      {totalFine > 0 && (
        <div style={{ padding:'16px 20px', background:'#fef3c7', borderRadius:12, border:'1px solid #fcd34d', marginTop:20, fontSize:14, color:'#92400e' }}>
          <strong>Note:</strong> Please pay your outstanding fine of ₹{totalFine} at the library counter to continue borrowing books.
        </div>
      )}
    </div>
  );
}
