
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination-wrapper">
      <button className="page-btn" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        <FiChevronLeft size={14} />
      </button>
      {start > 0 && <><button className="page-btn" onClick={() => onPageChange(0)}>1</button><span style={{padding:'0 4px',color:'var(--text-secondary)'}}>…</span></>}
      {pages.map(p => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && <><span style={{padding:'0 4px',color:'var(--text-secondary)'}}>…</span><button className="page-btn" onClick={() => onPageChange(totalPages - 1)}>{totalPages}</button></>}
      <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
        <FiChevronRight size={14} />
      </button>
    </div>
  );
}
