
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'dd MMM yyyy'); } catch { return date; }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try { return format(parseISO(date), 'dd MMM yyyy, h:mm a'); } catch { return date; }
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  try { return isPast(parseISO(dueDate)); } catch { return false; }
};

export const daysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  try {
    const due = parseISO(dueDate);
    const now = new Date();
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  } catch { return 0; }
};

export const calculateFine = (dueDate) => {
  const days = daysOverdue(dueDate);
  return days * 5;
};

export const getStatusBadge = (status) => {
  const map = {
    AVAILABLE: 'success', ISSUED: 'danger', RESERVED: 'warning', LOST: 'gray',
    PENDING: 'warning', FULFILLED: 'success', CANCELLED: 'gray', EXPIRED: 'gray',
    ROLE_ADMIN: 'info', ROLE_STUDENT: 'success'
  };
  return map[status] || 'gray';
};

export const truncate = (str, n = 40) => str && str.length > n ? str.substring(0, n) + '...' : str;

export const getInitials = (firstName, lastName) => {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
};
