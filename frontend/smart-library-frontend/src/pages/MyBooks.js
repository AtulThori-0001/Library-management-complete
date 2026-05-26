
import React, { useEffect, useState } from 'react';
import { getMyBooks } from '../services/transactionService';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBooks().then(r => setBooks(r.data.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const today = new Date();

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>My Books</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Books currently issued to you ({books.length} total)</p>
      </div>
      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : books.length === 0 ? <EmptyState icon="📚" title="No books issued" subtitle="Visit the library to borrow books." /> : (
          <table className="table-custom">
            <thead><tr><th>Book</th><th>ISBN</th><th>Issue Date</th><th>Due Date</th><th>Days Overdue</th><th>Fine (₹)</th><th>Status</th></tr></thead>
            <tbody>
              {books.map(t => {
                const days = Math.max(0, Math.floor((today - new Date(t.dueDate))/86400000));
                return (
                  <tr key={t.id}>
                    <td><strong>{t.bookTitle}</strong></td>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>{t.bookIsbn}</td>
                    <td>{formatDate(t.issueDate)}</td>
                    <td style={{ color: days>0 ? '#dc2626' : 'inherit', fontWeight: days>0 ? 600 : 'normal' }}>{formatDate(t.dueDate)}</td>
                    <td>{days > 0 ? <span className="badge-custom badge-danger">{days}d</span> : <span className="badge-custom badge-success">On time</span>}</td>
                    <td style={{ fontWeight:700, color: days>0 ? '#dc2626' : '#166534' }}>₹{days*5}</td>
                    <td><span className={`badge-custom badge-${days>0?'danger':'success'}`}>{days>0?'Overdue':'Active'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
