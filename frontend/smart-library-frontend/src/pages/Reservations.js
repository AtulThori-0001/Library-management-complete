
import React, { useEffect, useState, useCallback } from 'react';
import { getAllReservations, getMyReservations, cancelReservation, fulfillReservation } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

export default function Reservations() {
  const { isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = isAdmin() ? await getAllReservations(page) : await getMyReservations(page);
      setReservations(r.data.data.content);
      setTotalPages(r.data.data.totalPages);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const [processingId, setProcessingId] = useState(null);

  const handleCancel = async (id) => {
    setProcessingId(id);
    try { await cancelReservation(id); toast.success('Reservation Cancelled'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    setProcessingId(null);
  };

  const handleFulfill = async (id) => {
    setProcessingId(id);
    try { await fulfillReservation(id); toast.success('Reservation Fulfilled & Book Issued!'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    setProcessingId(null);
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>{isAdmin() ? 'All Reservations' : 'My Reservations'}</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Manage book reservations</p>
      </div>
      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : reservations.length === 0 ? <EmptyState icon="📅" title="No reservations" /> : (
          <table className="table-custom">
            <thead><tr>{isAdmin() && <th>Student</th>}<th>Book</th><th>Reserved On</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  {isAdmin() && <td><strong>{r.userName}</strong></td>}
                  <td>{r.bookTitle}</td>
                  <td>{formatDate(r.reservationDate)}</td>
                  <td>{formatDate(r.expiryDate)}</td>
                  <td><span className={`badge-custom badge-${getStatusBadge(r.status)}`}>{r.status}</span></td>
                  <td>
                    {r.status === 'PENDING' && (
                      <div style={{ display:'flex', gap:6 }}>
                        {isAdmin() && (
                          <button 
                            onClick={() => handleFulfill(r.id)} 
                            disabled={processingId === r.id}
                            style={{ background:'#dcfce7', border:'none', borderRadius:6, padding:'5px 10px', cursor: processingId === r.id ? 'not-allowed' : 'pointer', color:'#166534', fontSize:12, fontWeight:600, opacity: processingId === r.id ? 0.7 : 1 }}
                          >
                            {processingId === r.id ? 'Fulfilling...' : 'Fulfill'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleCancel(r.id)} 
                          disabled={processingId === r.id}
                          style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'5px 10px', cursor: processingId === r.id ? 'not-allowed' : 'pointer', color:'#991b1b', fontSize:12, fontWeight:600, opacity: processingId === r.id ? 0.7 : 1 }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
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
