
import React, { useEffect, useState, useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';
import { getAllTransactions, downloadReport } from '../services/transactionService';
import { toast } from 'react-toastify';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getAllTransactions(page);
      setTransactions(r.data.data.content);
      setTotalPages(r.data.data.totalPages);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (type) => {
    try {
      const r = await downloadReport(type);
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = `${type}-report.pdf`; a.click();
    } catch { toast.error('Download failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div><h4 style={{ fontWeight:700, margin:0 }}>Transactions</h4><p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>All book issue and return records</p></div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => handleDownload('all')} className="btn-primary-custom"><FiDownload /> All Report</button>
          <button onClick={() => handleDownload('overdue')} style={{ background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:14 }}><FiDownload /> Overdue Report</button>
        </div>
      </div>
      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : transactions.length === 0 ? <EmptyState icon="📋" title="No transactions found" /> : (
          <table className="table-custom">
            <thead><tr><th>#</th><th>Student</th><th>Book</th><th>Type</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Fine</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id}>
                  <td>{page*10+i+1}</td>
                  <td><div style={{ fontWeight:600 }}>{t.userName}</div><div style={{ fontSize:11, color:'var(--text-secondary)' }}>{t.userEmail}</div></td>
                  <td>{t.bookTitle}</td>
                  <td><span className={`badge-custom badge-${t.transactionType==='ISSUE'?'info':'success'}`}>{t.transactionType}</span></td>
                  <td>{formatDate(t.issueDate)}</td>
                  <td style={{ color: t.isOverdue ? '#dc2626' : 'inherit' }}>{formatDate(t.dueDate)}</td>
                  <td>{t.returnDate ? formatDate(t.returnDate) : '—'}</td>
                  <td style={{ fontWeight:600, color: t.fineAmount>0 ? '#dc2626' : '#166534' }}>₹{t.fineAmount||0}</td>
                  <td><span className={`badge-custom badge-${t.returnDate ? 'success' : t.isOverdue ? 'danger' : 'warning'}`}>{t.returnDate ? 'Returned' : t.isOverdue ? 'Overdue' : 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
