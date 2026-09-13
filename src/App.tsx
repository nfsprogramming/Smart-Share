import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CardEditor } from './pages/CardEditor';
import { PublicCard } from './pages/PublicCard';
import { Analytics } from './pages/Analytics';
import { Contacts } from './pages/Contacts';
import { QuickQR } from './pages/QuickQR';
import { Scan } from './pages/Scan';
import { Login } from './pages/Login';
import { AppLayout } from './layouts/AppLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useBackButton } from './hooks/useBackButton';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


function AppRoutes() {
  const { user } = useAuth();
  useBackButton(); // Handle hardware back button

  return (
    <Routes>
      {/* Public Card Route - No Auth Required */}
      <Route path="/@:username" element={<PublicCard />} />
      <Route path="/card/:id" element={<PublicCard />} />

      {/* Login Route - Redirect if already logged in */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <Login onLoginSuccess={() => { }} />
        }
      />

      {/* Protected App Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor" element={<CardEditor />} />
        <Route path="/editor/:id" element={<CardEditor />} />
        <Route path="/analytics/:id" element={<Analytics />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/quick-qr" element={<QuickQR />} />
        <Route path="/scan" element={<Scan />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
