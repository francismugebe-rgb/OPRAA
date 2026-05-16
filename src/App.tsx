/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProfileDetail } from './pages/ProfileDetail';
import { SubmitProfile } from './pages/SubmitProfile';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center font-serif italic text-2xl animate-pulse">
          Reviewing Today's Headlines...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-paper">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            <Route path="/submit" element={<SubmitProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
