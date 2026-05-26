
import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { getMyBooks } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiUsers, FiAlertCircle, FiCalendar, FiDollarSign, FiRepeat, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div className="stat-icon" style={{ background: bg }}><Icon color={color} size={22} /></div>
    </div>
    <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (isAdmin()) {
          const res = await getDashboardStats();
          setStats(res.data.data);
        } else {
          const res = await getMyBooks();
          setMyBooks(res.data.data || []);
        }
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="spinner-center"><Spinner /></div>;

  if (!isAdmin()) {
    return (
      <div>
        <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Welcome, {user?.firstName}!</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Here are your currently issued books.</p>
        <div className="content-card">
          <div className="card-header-custom"><FiBookOpen /> My Issued Books <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>{myBooks.length}</span></div>
          {myBooks.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No books currently issued</div> : (
            <table className="table-custom">
              <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {myBooks.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.bookTitle}</strong></td>
                    <td>{formatDate(t.issueDate)}</td>
                    <td style={{ color: t.isOverdue ? '#dc2626' : 'inherit' }}>{formatDate(t.dueDate)}</td>
                    <td><span className={`badge-custom badge-${t.isOverdue ? 'danger' : 'success'}`}>{t.isOverdue ? `Overdue (${t.daysOverdue}d)` : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  const categoryLabels = Object.keys(stats?.booksByCategory || {});
  const categoryValues = Object.values(stats?.booksByCategory || {});

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, margin: 0 }}>Dashboard</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Library overview and analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={FiBook}       label="Total Books"    value={stats?.totalBooks}       color="#2563eb" bg="#dbeafe" />
        <StatCard icon={FiUsers}      label="Students"       value={stats?.totalStudents}     color="#7c3aed" bg="#ede9fe" />
        <StatCard icon={FiRepeat}     label="Books Issued"   value={stats?.booksIssued}       color="#d97706" bg="#fef3c7" />
        <StatCard icon={FiTrendingUp} label="Available"      value={stats?.booksAvailable}    color="#16a34a" bg="#dcfce7" />
        <StatCard icon={FiAlertCircle}label="Overdue"        value={stats?.overdueBooks}      color="#dc2626" bg="#fee2e2" />
        <StatCard icon={FiCalendar}   label="Reservations"   value={stats?.pendingReservations} color="#0891b2" bg="#dbeafe" />
        <StatCard icon={FiDollarSign} label="Fines (₹)"      value={stats?.totalOutstandingFines?.toFixed?.(2) || '0.00'} color="#d97706" bg="#fef3c7" />
        <StatCard icon={FiRepeat}     label="Today"          value={stats?.totalTransactionsToday} color="#7c3aed" bg="#ede9fe" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="content-card">
          <div className="card-header-custom">Books by Category</div>
          <div style={{ padding: 20, height: 250 }}>
            {categoryLabels.length > 0 ? (
              <Bar data={{
                labels: categoryLabels,
                datasets: [{ label: 'Books', data: categoryValues, backgroundColor: '#2563eb', borderRadius: 6 }]
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : <div style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingTop: 80 }}>No data</div>}
          </div>
        </div>
        <div className="content-card">
          <div className="card-header-custom">Book Status</div>
          <div style={{ padding: 20, height: 250 }}>
            <Doughnut data={{
              labels: ['Available', 'Issued', 'Overdue'],
              datasets: [{ data: [stats?.booksAvailable || 0, stats?.booksIssued || 0, stats?.overdueBooks || 0], backgroundColor: ['#16a34a', '#d97706', '#dc2626'], borderWidth: 0 }]
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header-custom">Recent Transactions</div>
        {!stats?.recentTransactions?.length ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No recent transactions</div> : (
          <table className="table-custom">
            <thead><tr><th>#</th><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {stats.recentTransactions.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.userName}</td>
                  <td>{t.bookTitle}</td>
                  <td>{formatDate(t.issueDate)}</td>
                  <td style={{ color: t.isOverdue ? '#dc2626' : 'inherit' }}>{formatDate(t.dueDate)}</td>
                  <td><span className={`badge-custom badge-${t.returnDate ? 'success' : t.isOverdue ? 'danger' : 'warning'}`}>{t.returnDate ? 'Returned' : t.isOverdue ? 'Overdue' : 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
