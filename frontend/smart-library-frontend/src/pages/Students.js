
import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiEye } from 'react-icons/fi';
import { getAllStudents, deactivateStudent, activateStudent } from '../services/userService';
import { toast } from 'react-toastify';
import { formatDate, getInitials } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getAllStudents(page, 10, search);
      setStudents(r.data.data.content);
      setTotalPages(r.data.data.totalPages);
      setTotalElements(r.data.data.totalElements);
    } catch { toast.error('Failed to load students'); }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = e => { e.preventDefault(); setSearch(keyword); setPage(0); };

  const toggleStatus = async (s) => {
    try {
      if (s.isActive) { await deactivateStudent(s.id); toast.success('Student deactivated'); }
      else { await activateStudent(s.id); toast.success('Student activated'); }
      load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Action failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div><h4 style={{ fontWeight:700, margin:0 }}>Students</h4><p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>{totalElements} students registered</p></div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
          <div style={{ position:'relative' }}>
            <FiSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)' }} />
            <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search by name, email, student ID..."
              style={{ paddingLeft:32, border:'1px solid var(--border-color)', borderRadius:8, padding:'8px 12px 8px 32px', background:'var(--bg-card)', color:'var(--text-primary)', outline:'none', width:280 }} />
          </div>
          <button type="submit" className="btn-primary-custom">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setKeyword(''); setPage(0); }} style={{ padding:'8px 14px', border:'1px solid var(--border-color)', borderRadius:8, background:'var(--bg-card)', color:'var(--text-primary)', cursor:'pointer' }}>Clear</button>}
        </form>
      </div>
      <div className="content-card">
        {loading ? <div className="spinner-center"><Spinner /></div> : students.length === 0 ? <EmptyState icon="👥" title="No students found" /> : (
          <table className="table-custom">
            <thead><tr><th>Student</th><th>Student ID</th><th>Department</th><th>Semester</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{getInitials(s.firstName, s.lastName)}</div>
                      <div><div style={{ fontWeight:600 }}>{s.firstName} {s.lastName}</div><div style={{ fontSize:11, color:'var(--text-secondary)' }}>@{s.username}</div></div>
                    </div>
                  </td>
                  <td style={{ fontFamily:'monospace', fontSize:12 }}>{s.studentId || '—'}</td>
                  <td>{s.department || '—'}</td>
                  <td>{s.semester ? `Sem ${s.semester}` : '—'}</td>
                  <td style={{ fontSize:12 }}>{s.email}</td>
                  <td><span className={`badge-custom badge-${s.isActive ? 'success' : 'danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{formatDate(s.createdAt)}</td>
                  <td>
                    <button onClick={() => toggleStatus(s)} title={s.isActive ? 'Deactivate' : 'Activate'}
                      style={{ background: s.isActive ? '#fee2e2' : '#dcfce7', border:'none', borderRadius:6, padding:'6px 8px', cursor:'pointer', color: s.isActive ? '#991b1b' : '#166534' }}>
                      {s.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                    </button>
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
