// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/DashboardLayout';
import { ProtectedRoute, RoleBasedRoute, PublicRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentPage from './pages/admin/Student';
import StudentDetails from './pages/admin/StudentDetails';
import FacultyPage from './pages/admin/Faculty';
import CoursesPage from './pages/admin/Courses';
import EventsPage from './pages/admin/Events';

// Loading component using the accent color
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

function AppContent() {
  const { loading } = useAuth(); // Assume AuthContext provides a loading state

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only pages */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FacultyPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CoursesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EventsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;