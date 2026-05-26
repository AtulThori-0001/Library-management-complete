
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSearch, FiCheck, FiArrowDownCircle } from 'react-icons/fi';
import { issueBook } from '../services/transactionService';
import { searchBooks, getBookById } from '../services/bookService';
import { getAllStudents } from '../services/userService';
import { formatDate } from '../utils/helpers';

export default function IssueBook() {
  const [studentSearch, setStudentSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bookIsbn, setBookIsbn] = useState('');
  const [book, setBook] = useState(null);
  const [issueDays, setIssueDays] = useState(14);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState(null);

  const searchStudents = async () => {
    if (!studentSearch.trim()) return;
    try { const r = await getAllStudents(0, 5, studentSearch); setStudents(r.data.data.content); }
    catch { toast.error('Search failed'); }
  };

  const fetchBook = async () => {
    if (!bookIsbn.trim()) return;
    try {
      const r = await searchBooks(bookIsbn.trim(), 0, 1);
      const books = r.data.data.content;
      if (books.length > 0) setBook(books[0]);
      else { toast.error('Book not found'); setBook(null); }
    } catch { toast.error('Book not found'); }
  };

  const handleIssue = async () => {
    if (!selectedStudent) return toast.error('Please select a student');
    if (!book) return toast.error('Please search and select a book');
    if (book.availableCopies === 0) return toast.error('No copies available');
    setLoading(true);
    try {
      const r = await issueBook({ userId: selectedStudent.id, bookId: book.id, issueDays: parseInt(issueDays), remarks });
      setIssued(r.data.data);
      toast.success('Book issued successfully!');
      setSelectedStudent(null); setStudentSearch(''); setStudents([]); setBook(null); setBookIsbn(''); setRemarks('');
    } catch (err) { toast.error(err?.response?.data?.message || 'Issue failed'); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>Issue Book</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Issue a book to a registered student</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:900 }}>
        <div className="content-card" style={{ padding:24 }}>
          <h6 style={{ fontWeight:700, marginBottom:16 }}>1. Select Student</h6>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && searchStudents()} placeholder="Search by name or student ID..." style={{ flex:1, border:'1px solid var(--border-color)', borderRadius:8, padding:'8px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
            <button onClick={searchStudents} className="btn-primary-custom"><FiSearch /></button>
          </div>
          {students.map(s => (
            <div key={s.id} onClick={() => { setSelectedStudent(s); setStudents([]); setStudentSearch(''); }} style={{ padding:'10px 12px', borderRadius:8, cursor:'pointer', background: selectedStudent?.id===s.id ? '#dbeafe' : 'var(--bg-body)', marginBottom:6, border:'1px solid var(--border-color)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div><div style={{ fontWeight:600 }}>{s.firstName} {s.lastName}</div><div style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.studentId} · {s.department}</div></div>
              {selectedStudent?.id===s.id && <FiCheck color="#2563eb" />}
            </div>
          ))}
          {selectedStudent && (
            <div style={{ padding:'12px', background:'#dcfce7', borderRadius:8, marginTop:8 }}>
              <div style={{ fontWeight:600, color:'#166534' }}>✓ {selectedStudent.firstName} {selectedStudent.lastName}</div>
              <div style={{ fontSize:12, color:'#166534' }}>{selectedStudent.studentId} · {selectedStudent.email}</div>
            </div>
          )}
        </div>

        <div className="content-card" style={{ padding:24 }}>
          <h6 style={{ fontWeight:700, marginBottom:16 }}>2. Select Book</h6>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <input value={bookIsbn} onChange={e => setBookIsbn(e.target.value)} onKeyDown={e => e.key==='Enter' && fetchBook()} placeholder="Enter ISBN or book title..." style={{ flex:1, border:'1px solid var(--border-color)', borderRadius:8, padding:'8px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
            <button onClick={fetchBook} className="btn-primary-custom"><FiSearch /></button>
          </div>
          {book && (
            <div style={{ padding:'12px', background: book.availableCopies>0 ? '#dcfce7' : '#fee2e2', borderRadius:8 }}>
              <div style={{ fontWeight:600 }}>{book.title}</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{book.author} · ISBN: {book.isbn}</div>
              <div style={{ fontSize:12, marginTop:4, fontWeight:600, color: book.availableCopies>0 ? '#166534' : '#991b1b' }}>{book.availableCopies > 0 ? `${book.availableCopies} copies available` : 'Not available'}</div>
            </div>
          )}
        </div>
      </div>

      <div className="content-card" style={{ padding:24, maxWidth:900, marginTop:20 }}>
        <h6 style={{ fontWeight:700, marginBottom:16 }}>3. Issue Details</h6>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:5 }}>Issue Period (days)</label>
            <input type="number" value={issueDays} onChange={e => setIssueDays(e.target.value)} min="1" max="60"
              style={{ width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
            <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>Due date: {new Date(Date.now() + parseInt(issueDays||14)*24*60*60*1000).toLocaleDateString()}</p>
          </div>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:5 }}>Remarks</label>
            <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional notes..."
              style={{ width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
          </div>
        </div>
        <div style={{ marginTop:20 }}>
          <button onClick={handleIssue} disabled={loading || !selectedStudent || !book} className="btn-primary-custom" style={{ opacity: (!selectedStudent || !book) ? 0.6 : 1 }}>
            <FiArrowDownCircle /> {loading ? 'Issuing...' : 'Issue Book'}
          </button>
        </div>
      </div>

      {issued && (
        <div className="content-card" style={{ padding:24, maxWidth:900, marginTop:20, background:'#dcfce7', border:'1px solid #86efac' }}>
          <h6 style={{ fontWeight:700, color:'#166534', marginBottom:8 }}>✓ Book Issued Successfully!</h6>
          <p style={{ fontSize:13, color:'#166534' }}>Transaction ID: #{issued.id} · Due Date: {formatDate(issued.dueDate)}</p>
        </div>
      )}
    </div>
  );
}
