
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';
import Spinner from './components/common/Spinner';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Books = lazy(() => import('./pages/Books'));
const AddEditBook = lazy(() => import('./pages/AddEditBook'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Students = lazy(() => import('./pages/Students'));
const Transactions = lazy(() => import('./pages/Transactions'));
const IssueBook = lazy(() => import('./pages/IssueBook'));
const ReturnBook = lazy(() => import('./pages/ReturnBook'));
const Overdue = lazy(() => import('./pages/Overdue'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Profile = lazy(() => import('./pages/Profile'));
const MyBooks = lazy(() => import('./pages/MyBooks'));
const Fines = lazy(() => import('./pages/Fines'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<div className="spinner-center"><Spinner /></div>}>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="books" element={<Books />} />
                <Route path="books/add" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
                <Route path="books/edit/:id" element={<ProtectedRoute adminOnly><AddEditBook /></ProtectedRoute>} />
                <Route path="books/:id" element={<BookDetail />} />
                <Route path="students" element={<ProtectedRoute adminOnly><Students /></ProtectedRoute>} />
                <Route path="transactions" element={<ProtectedRoute adminOnly><Transactions /></ProtectedRoute>} />
                <Route path="issue" element={<ProtectedRoute adminOnly><IssueBook /></ProtectedRoute>} />
                <Route path="return" element={<ProtectedRoute adminOnly><ReturnBook /></ProtectedRoute>} />
                <Route path="overdue" element={<ProtectedRoute adminOnly><Overdue /></ProtectedRoute>} />
                <Route path="reservations" element={<ProtectedRoute adminOnly><Reservations /></ProtectedRoute>} />
                <Route path="my-books" element={<MyBooks />} />
                <Route path="my-reservations" element={<Reservations />} />
                <Route path="fines" element={<Fines />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
          newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </ThemeProvider>
    </AuthProvider>
  );
}
