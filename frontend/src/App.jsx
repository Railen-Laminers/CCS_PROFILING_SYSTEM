// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/ui/Toast';
import DashboardLayout from './components/layout/DashboardLayout';
import { ProtectedRoute, RoleBasedRoute, PublicRoute } from './components/ProtectedRoute';
import Login from './pages/public/Login';
import ResetPassword from './pages/public/ResetPassword';
import Dashboard from './pages/private/Dashboard';
import StudentPage from './pages/private/admin/Student';
import StudentDetails from './pages/private/admin/StudentDetails';
import FacultyPage from './pages/private/admin/Faculty';
import FacultyDetails from './pages/private/admin/FacultyDetails';
import EventsPage from './pages/private/admin/Events';
import InstructionPage from './pages/private/admin/Instruction';
import CourseDetail from './pages/private/admin/CourseDetail';
import Reports from './pages/private/admin/Reports';
import Scheduling from './pages/private/admin/Scheduling';
import SchedulingRoomDetail from './pages/private/admin/SchedulingRoomDetail';
import SystemSettings from './pages/private/SystemSettings';
import Profile from './pages/private/Profile';
import StudentDashboard from './pages/private/student/Dashboard';
import MyEvents from './pages/private/student/MyEvents';
import MySchedule from './pages/private/student/MySchedule';
import MyCurriculum from './pages/private/student/MyCurriculum';
import MyDetails from './pages/private/student/MyDetails';
import AcademicPerformance from './pages/private/student/AcademicPerformance';
import MedicalRecords from './pages/private/student/MedicalRecords';
import SportsActivities from './pages/private/student/SportsActivities';
import Organizations from './pages/private/student/Organizations';
import BehaviorRecords from './pages/private/student/BehaviorRecords';
import Events from './pages/private/student/Events';
import FacultyDashboard from './pages/private/faculty/Dashboard';
import FacultyMySchedule from './pages/private/faculty/MySchedule';
import FacultyMyStudents from './pages/private/faculty/MyStudents';
import FacultyMyDetails from './pages/private/faculty/MyDetails';
import FacultySkills from './pages/private/faculty/Skills';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

// Wrapper component that redirects to role-based dashboard
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
    default:
      return <Dashboard />;
  }
};

function AppContent() {
  const { loading } = useAuth();

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
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Main Dashboard - redirects based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoleBasedDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Student-specific routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-details"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <MyDetails />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-schedule"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <MySchedule />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-curriculum"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <MyCurriculum />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/academic"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <AcademicPerformance />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/medical"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <MedicalRecords />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/sports"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <SportsActivities />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/organizations"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <Organizations />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/behavior"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <BehaviorRecords />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <Events />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Faculty-specific routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyDashboard />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/my-schedule"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyMySchedule />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/my-students"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyMyStudents />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/my-details"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyMyDetails />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/skills"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultySkills />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin-only pages */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <StudentPage />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <StudentDetails />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <FacultyPage />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <FacultyDetails />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <EventsPage />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/instruction"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <InstructionPage />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/instruction/course/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <CourseDetail />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scheduling"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <Scheduling />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/scheduling/room/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <SchedulingRoomDetail />
              </DashboardLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SystemSettings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
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
              <RoleBasedDashboard />
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
      <ToastProvider>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
          <Toast />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;