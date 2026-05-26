
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById } from '../services/bookService';
import { makeReservation } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit2, FiCalendar, FiBook } from 'react-icons/fi';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    getBookById(id).then(r => setBook(r.data.data)).catch(() => { toast.error('Book not found'); navigate('/books'); }).finally(() => setLoading(false));
  }, [id]);

  const handleReserve = async () => {
    setReserving(true);
    try { await makeReservation({ bookId: id }); toast.success('Book reserved!'); }
    catch (err) { toast.error(err?.response?.data?.message || 'Reservation failed'); }
    setReserving(false);
  };

  if (loading) return <div className="spinner-center"><Spinner /></div>;
  if (!book) return null;

  const Row = ({ label, value }) => (
    <div style={{ display:'flex', padding:'10px 0', borderBottom:'1px solid var(--border-color)' }}>
      <div style={{ width:160, color:'var(--text-secondary)', fontSize:13, fontWeight:500 }}>{label}</div>
      <div style={{ flex:1, fontWeight:500 }}>{value || '—'}</div>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => navigate('/books')} style={{ background:'none', border:'1px solid var(--border-color)', borderRadius:8, padding:'8px 10px', cursor:'pointer', color:'var(--text-primary)', display:'flex' }}><FiArrowLeft /></button>
        <h4 style={{ fontWeight:700, margin:0 }}>Book Details</h4>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
        <div className="content-card" style={{ padding:28 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, gap:12 }}>
            <div>
              <h3 style={{ fontWeight:800, margin:0 }}>{book.title}</h3>
              <p style={{ color:'var(--text-secondary)', marginTop:4 }}>by {book.author}</p>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <span className={`badge-custom badge-${getStatusBadge(book.status)}`}>{book.status}</span>
              {isAdmin() && <Link to={`/books/edit/${book.id}`} className="btn-primary-custom"><FiEdit2 size={14} /></Link>}
            </div>
          </div>
          {book.description && <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6, marginBottom:20 }}>{book.description}</p>}
          <Row label="ISBN" value={book.isbn} />
          <Row label="Publisher" value={book.publisher} />
          <Row label="Year" value={book.publishYear} />
          <Row label="Edition" value={book.edition} />
          <Row label="Language" value={book.language} />
          <Row label="Pages" value={book.pages} />
          <Row label="Category" value={book.category} />
          <Row label="Location" value={book.location} />
          <Row label="Price" value={book.price ? `₹${book.price}` : null} />
          <Row label="Added" value={formatDate(book.createdAt)} />
        </div>
        <div>
          <div className="content-card" style={{ padding:24, textAlign:'center' }}>
            <div style={{ width:80, height:80, background:'#dbeafe', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiBook color="#2563eb" size={36} />
            </div>
            <div style={{ fontSize:32, fontWeight:800, color: book.availableCopies === 0 ? '#dc2626' : '#16a34a' }}>{book.availableCopies}</div>
            <div style={{ color:'var(--text-secondary)', fontSize:13 }}>of {book.totalCopies} copies available</div>
            {!isAdmin() && (
              <div style={{ marginTop:20 }}>
                {book.availableCopies > 0 && (
                  <div style={{ padding:'12px', background:'#dcfce7', borderRadius:8, color:'#166534', fontSize:13, marginBottom:12 }}>✓ Available to issue at library</div>
                )}
                <button onClick={handleReserve} disabled={reserving} className="btn-primary-custom" style={{ width:'100%', justifyContent:'center' }}>
                  <FiCalendar /> {reserving ? 'Reserving...' : 'Reserve This Book'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
