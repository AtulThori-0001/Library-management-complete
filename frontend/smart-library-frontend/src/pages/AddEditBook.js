import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { addBook, updateBook, getBookById } from '../services/bookService';

const CATEGORIES = ['Computer Science','Mathematics','Physics','Chemistry','Literature','History','Science','Engineering','Medicine','Economics','Philosophy','Arts'];

const Field = ({ name, label, type='text', required, as, options, rows, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:5 }}>{label}{required && ' *'}</label>
    {as === 'textarea' ? (
      <textarea name={name} value={value} onChange={onChange} rows={rows||3}
        style={{ width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', resize:'vertical', fontSize:14 }} />
    ) : as === 'select' ? (
      <select name={name} value={value} onChange={onChange}
        style={{ width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }}>
        <option value="">Select {label}</option>
        {options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input name={name} type={type} value={value} onChange={onChange} required={required}
        style={{ width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 }} />
    )}
  </div>
);

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title:'',author:'',isbn:'',publisher:'',publishYear:'',category:'',description:'',totalCopies:1,price:'',location:'',edition:'',language:'English',pages:'' });

  useEffect(() => {
    if (isEdit) {
      getBookById(id).then(r => {
        const b = r.data.data;
        setForm({ title:b.title||'',author:b.author||'',isbn:b.isbn||'',publisher:b.publisher||'',publishYear:b.publishYear||'',category:b.category||'',description:b.description||'',totalCopies:b.totalCopies||1,price:b.price||'',location:b.location||'',edition:b.edition||'',language:b.language||'English',pages:b.pages||'' });
      }).catch(() => { toast.error('Book not found'); navigate('/books'); });
    }
  }, [id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, totalCopies: parseInt(form.totalCopies)||1, price: parseFloat(form.price)||0, publishYear: form.publishYear ? parseInt(form.publishYear) : null, pages: form.pages ? parseInt(form.pages) : null };
      if (isEdit) await updateBook(id, data); else await addBook(data);
      toast.success(isEdit ? 'Book updated!' : 'Book added!');
      navigate('/books');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to save'); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => navigate('/books')} style={{ background:'none', border:'1px solid var(--border-color)', borderRadius:8, padding:'8px 10px', cursor:'pointer', color:'var(--text-primary)', display:'flex' }}><FiArrowLeft /></button>
        <div><h4 style={{ fontWeight:700, margin:0 }}>{isEdit ? 'Edit Book' : 'Add New Book'}</h4></div>
      </div>
      <div className="content-card" style={{ padding:28, maxWidth:720 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
            <div style={{ gridColumn:'1/-1' }}><Field name="title" label="Book Title" required value={form.title} onChange={handleChange} /></div>
            <Field name="author" label="Author" required value={form.author} onChange={handleChange} />
            <Field name="isbn" label="ISBN" required value={form.isbn} onChange={handleChange} />
            <Field name="publisher" label="Publisher" value={form.publisher} onChange={handleChange} />
            <Field name="publishYear" label="Publish Year" type="number" value={form.publishYear} onChange={handleChange} />
            <Field name="category" label="Category" as="select" options={CATEGORIES} value={form.category} onChange={handleChange} />
            <Field name="edition" label="Edition" value={form.edition} onChange={handleChange} />
            <Field name="language" label="Language" value={form.language} onChange={handleChange} />
            <Field name="pages" label="Pages" type="number" value={form.pages} onChange={handleChange} />
            <Field name="totalCopies" label="Total Copies" type="number" required value={form.totalCopies} onChange={handleChange} />
            <Field name="price" label="Price (₹)" type="number" value={form.price} onChange={handleChange} />
            <Field name="location" label="Shelf Location" value={form.location} onChange={handleChange} />
            <div style={{ gridColumn:'1/-1' }}><Field name="description" label="Description" as="textarea" rows={4} value={form.description} onChange={handleChange} /></div>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
            <button type="button" onClick={() => navigate('/books')} style={{ padding:'10px 20px', border:'1px solid var(--border-color)', borderRadius:8, background:'var(--bg-card)', color:'var(--text-primary)', cursor:'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary-custom"><FiSave /> {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
