
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { getAllBooks, searchBooks, deleteBook, getAllCategories, getBooksByCategory } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';

export default function Books() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (search) res = await searchBooks(search, page);
      else if (selectedCat) res = await getBooksByCategory(selectedCat, page);
      else res = await getAllBooks(page);
      setBooks(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch { toast.error('Failed to load books'); }
    setLoading(false);
  }, [page, search, selectedCat]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getAllCategories().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  const handleSearch = e => { e.preventDefault(); setSearch(keyword); setPage(0); };
  const handleDelete = async () => {
    try { await deleteBook(confirm.id); toast.success('Book deleted'); setConfirm({ show: false }); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete'); setConfirm({ show: false }); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontWeight: 700, margin: 0 }}>Books</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Browse and manage library books</p>
        </div>
        {isAdmin() && <Link to="/books/add" className="btn-primary-custom"><FiPlus /> Add Book</Link>}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search books..."
              style={{ paddingLeft: 32, border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px 8px 32px', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', minWidth: 240 }} />
          </div>
          <button type="submit" className="btn-primary-custom">Search</button>
          {(search || selectedCat) && <button type="button" onClick={() => { setSearch(''); setKeyword(''); setSelectedCat(''); setPage(0); }}
            style={{ padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>Clear</button>}
        </form>
        <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setPage(0); setSearch(''); setKeyword(''); }}
          style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px', background: 'var(--bg-card)', color: 'var(--text-primary)', minWidth: 160 }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : books.length === 0 ? <EmptyState icon="📚" title="No books found" /> : (
          <table className="table-custom">
            <thead><tr><th>#</th><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Copies</th><th>Status</th><th>Added</th>{isAdmin() && <th>Actions</th>}</tr></thead>
            <tbody>
              {books.map((b, i) => (
                <tr key={b.id}>
                  <td>{page * 10 + i + 1}</td>
                  <td><Link to={`/books/${b.id}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}><FiBookOpen style={{ marginRight: 6 }} />{b.title}</Link></td>
                  <td>{b.author}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.isbn}</td>
                  <td>{b.category && <span className="badge-custom badge-info">{b.category}</span>}</td>
                  <td><span style={{ fontWeight: 600, color: b.availableCopies === 0 ? '#dc2626' : 'inherit' }}>{b.availableCopies}</span>/{b.totalCopies}</td>
                  <td><span className={`badge-custom badge-${getStatusBadge(b.status)}`}>{b.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(b.createdAt)}</td>
                  {isAdmin() && (
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/books/edit/${b.id}`)} style={{ background: '#dbeafe', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#1e40af' }}><FiEdit2 size={14} /></button>
                        <button onClick={() => setConfirm({ show: true, id: b.id })} style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#991b1b' }}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmDialog show={confirm.show} title="Delete Book" message="Are you sure you want to delete this book? This action cannot be undone."
        danger onConfirm={handleDelete} onCancel={() => setConfirm({ show: false })} />
    </div>
  );
}
